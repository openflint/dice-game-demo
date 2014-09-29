package com.infthink.fling.demo.dice;

import java.io.IOException;

import tv.matchstick.fling.ApplicationMetadata;
import tv.matchstick.fling.ConnectionResult;
import tv.matchstick.fling.Fling;
import tv.matchstick.fling.FlingDevice;
import tv.matchstick.fling.FlingManager;
import tv.matchstick.fling.FlingMediaControlIntent;
import tv.matchstick.fling.ResultCallback;
import tv.matchstick.fling.Status;
import tv.matchstick.fling.Fling.ApplicationConnectionResult;
import android.content.Context;
import android.os.Bundle;
import android.support.v4.view.MenuItemCompat;
import android.support.v7.app.MediaRouteActionProvider;
import android.support.v7.media.MediaRouteSelector;
import android.support.v7.media.MediaRouter;
import android.support.v7.media.MediaRouter.RouteInfo;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;

public class FlingDiceManager {
    private static final String TAG = FlingDiceManager.class.getSimpleName();

    private Context mContext;
    private String mApplicationId;

    private MediaRouter mMediaRouter;
    private MediaRouteSelector mMediaRouteSelector;
    private MediaRouterCallback mMediaRouterCallback;
    private FlingDevice mSelectedDevice;
    private FlingManager mApiClient;
    private FlingListener mFlingListener;
    private ConnectionCallbacks mConnectionCallbacks;
    private ConnectionFailedListener mConnectionFailedListener;

    private DiceChannel mGameChannel;

    public FlingDiceManager(Context context, String applicationId) {
        mContext = context;
        mApplicationId = applicationId;

        Log.d(TAG, "Application ID is: " + mApplicationId);

        mGameChannel = new DiceChannel();

        mMediaRouter = MediaRouter.getInstance(mContext);
        mMediaRouteSelector = new MediaRouteSelector.Builder()
                .addControlCategory(
                        FlingMediaControlIntent
                                .categoryForFling(mApplicationId)).build();

        mMediaRouterCallback = new MediaRouterCallback();
        mFlingListener = new FlingListener();
        mConnectionCallbacks = new ConnectionCallbacks();
        mConnectionFailedListener = new ConnectionFailedListener();

        mMediaRouter.addCallback(mMediaRouteSelector, mMediaRouterCallback,
                MediaRouter.CALLBACK_FLAG_PERFORM_ACTIVE_SCAN);
    }

    private String getAppId() {
        return mApplicationId;
    }

    /**
     * Create mediarouter button
     * 
     * @param menu
     * @param menuResourceId
     * @return
     */
    public MenuItem addMediaRouterButton(Menu menu, int menuResourceId) {
        MenuItem mediaRouteMenuItem = menu.findItem(menuResourceId);
        MediaRouteActionProvider mediaRouteActionProvider = (MediaRouteActionProvider) MenuItemCompat
                .getActionProvider(mediaRouteMenuItem);
        mediaRouteActionProvider.setRouteSelector(mMediaRouteSelector);
        return mediaRouteMenuItem;
    }

    public void destroy() {
        setSelectedDevice(null);
        mMediaRouter.removeCallback(mMediaRouterCallback);
    }

    /**
     * An extension of the MediaRoute.Callback specifically for the Dice
     * game.
     */
    private class MediaRouterCallback extends MediaRouter.Callback {
        @Override
        public void onRouteSelected(MediaRouter router, RouteInfo route) {
            Log.d(TAG, "onRouteSelected: " + route);
            FlingDevice device = FlingDevice.getFromBundle(route.getExtras());
            setSelectedDevice(device);
        }

        @Override
        public void onRouteUnselected(MediaRouter router, RouteInfo route) {
            Log.d(TAG, "onRouteUnselected: " + route);
            setSelectedDevice(null);
        }
    }

    private void setSelectedDevice(FlingDevice device) {
        Log.d(TAG, "setSelectedDevice: " + device);
        mSelectedDevice = device;
        if (mSelectedDevice != null) {
            try {
                disconnectApiClient();
                connectApiClient();
            } catch (IllegalStateException e) {
                Log.w(TAG, "Exception while connecting API client", e);
                disconnectApiClient();
            }
        } else {
            if (mApiClient != null) {
                if (mApiClient.isConnected()) {
                    Fling.FlingApi.stopApplication(mApiClient);
                }
                disconnectApiClient();
            }
            mMediaRouter.selectRoute(mMediaRouter.getDefaultRoute());
        }
    }

    /**
     * Connect select device
     * 
     * @param device
     */
    private void connectApiClient() {
        Fling.FlingOptions apiOptions = Fling.FlingOptions.builder(
                mSelectedDevice, mFlingListener).build();
        mApiClient = new FlingManager.Builder(mContext)
                .addApi(Fling.API, apiOptions)
                .addConnectionCallbacks(mConnectionCallbacks)
                .addOnConnectionFailedListener(mConnectionFailedListener)
                .build();
        mApiClient.connect();
    }

    /**
     * Disconnect device
     * 
     * @param device
     */
    private void disconnectApiClient() {
        if (mApiClient != null) {
            mApiClient.disconnect();
            mApiClient = null;
        }
    }

    private class FlingListener extends Fling.Listener {
        @Override
        public void onApplicationDisconnected(int statusCode) {
            Log.d(TAG, "Fling.Listener.onApplicationDisconnected: "
                    + statusCode);
            try {
                Fling.FlingApi.removeMessageReceivedCallbacks(mApiClient,
                        mGameChannel.getNamespace());
            } catch (IOException e) {
                Log.w(TAG, "Exception while launching application", e);
            }
        }
    }

    /**
     * FlingManager.ConnectionCallbacks and
     * FlingManager.OnConnectionFailedListener callbacks to be informed of the
     * connection status. All of the callbacks run on the main UI thread.
     * 
     * @author changxing
     * 
     */
    private class ConnectionCallbacks implements
            FlingManager.ConnectionCallbacks {
        @Override
        public void onConnectionSuspended(int cause) {
            Log.d(TAG, "ConnectionCallbacks.onConnectionSuspended");
        }

        @Override
        public void onConnected(Bundle connectionHint) {
            Log.d(TAG, "ConnectionCallbacks.onConnected");
            Fling.FlingApi.launchApplication(mApiClient, getAppId())
                    .setResultCallback(new ConnectionResultCallback());
        }
    }

    private class ConnectionFailedListener implements
            FlingManager.OnConnectionFailedListener {
        @Override
        public void onConnectionFailed(ConnectionResult result) {
            Log.d(TAG, "ConnectionFailedListener.onConnectionFailed");
            setSelectedDevice(null);
        }
    }

    private final class ConnectionResultCallback implements
            ResultCallback<ApplicationConnectionResult> {
        @Override
        public void onResult(ApplicationConnectionResult result) {
            Status status = result.getStatus();
            ApplicationMetadata appMetaData = result.getApplicationMetadata();

            if (status.isSuccess()) {
                Log.d(TAG, "ConnectionResultCallback: " + appMetaData.getName());
                try {
                    Fling.FlingApi.setMessageReceivedCallbacks(mApiClient,
                            mGameChannel.getNamespace(), mGameChannel);
                } catch (IOException e) {
                    Log.w(TAG, "Exception while launching application", e);
                }
            } else {
                Log.d(TAG,
                        "ConnectionResultCallback. Unable to launch the game. statusCode: "
                                + status.getStatusCode());
            }
        }
    }

    public void startShake() {
        if (mApiClient != null && mApiClient.isConnected()) {
            mGameChannel.start(mApiClient);
        }
    }

    public void stopShake() {
        if (mApiClient != null && mApiClient.isConnected()) {
            mGameChannel.stop(mApiClient);
        }
    }

}
