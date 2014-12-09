package com.infthink.flint.demo.dice;

import java.io.IOException;

import tv.matchstick.flint.ApplicationMetadata;
import tv.matchstick.flint.ConnectionResult;
import tv.matchstick.flint.Flint;
import tv.matchstick.flint.FlintDevice;
import tv.matchstick.flint.FlintManager;
import tv.matchstick.flint.FlintMediaControlIntent;
import tv.matchstick.flint.ResultCallback;
import tv.matchstick.flint.Status;
import tv.matchstick.flint.Flint.ApplicationConnectionResult;
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
    private String mApplicationUrl;

    private MediaRouter mMediaRouter;
    private MediaRouteSelector mMediaRouteSelector;
    private MediaRouterCallback mMediaRouterCallback;
    private FlintDevice mSelectedDevice;
    private FlintManager mApiClient;
    private FlintListener mFlingListener;
    private ConnectionCallbacks mConnectionCallbacks;

    private DiceChannel mGameChannel;

    public FlingDiceManager(Context context, String url) {
        mContext = context;
        mApplicationUrl = url;

        Log.d(TAG, "Application URL is: " + mApplicationUrl);

        String APPLICATION_ID = "~dice";
        Flint.FlintApi.setApplicationId(APPLICATION_ID);
        
        mGameChannel = new DiceChannel();

        mMediaRouter = MediaRouter.getInstance(mContext);
        mMediaRouteSelector = new MediaRouteSelector.Builder()
                .addControlCategory(
                        FlintMediaControlIntent
                                .categoryForFlint(APPLICATION_ID)).build();

        mMediaRouterCallback = new MediaRouterCallback();
        mFlingListener = new FlintListener();
        mConnectionCallbacks = new ConnectionCallbacks();

        mMediaRouter.addCallback(mMediaRouteSelector, mMediaRouterCallback,
                MediaRouter.CALLBACK_FLAG_PERFORM_ACTIVE_SCAN);
    }

    private String getAppUrl() {
        return mApplicationUrl;
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
            FlintDevice device = FlintDevice.getFromBundle(route.getExtras());
            setSelectedDevice(device);
        }

        @Override
        public void onRouteUnselected(MediaRouter router, RouteInfo route) {
            Log.d(TAG, "onRouteUnselected: " + route);
            setSelectedDevice(null);
        }
    }

    private void setSelectedDevice(FlintDevice device) {
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
                    Flint.FlintApi.stopApplication(mApiClient);
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
        Flint.FlintOptions apiOptions = Flint.FlintOptions.builder(
                mSelectedDevice, mFlingListener).build();
        mApiClient = new FlintManager.Builder(mContext)
                .addApi(Flint.API, apiOptions)
                .addConnectionCallbacks(mConnectionCallbacks)
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

    private class FlintListener extends Flint.Listener {
        @Override
        public void onApplicationDisconnected(int statusCode) {
            Log.d(TAG, "Fling.Listener.onApplicationDisconnected: "
                    + statusCode);
            if (mApiClient != null) {
                if (mApiClient.isConnected() || mApiClient.isConnecting()) {
                    try {
                        Flint.FlintApi.stopApplication(mApiClient);
                        Flint.FlintApi.removeMessageReceivedCallbacks(
                                mApiClient, mGameChannel.getNamespace());
                    } catch (IOException e) {
                        Log.e(TAG, "Exception while removing channel", e);
                    }
                    mApiClient.disconnect();
                }
                mApiClient = null;
            }
            mSelectedDevice = null;
            mMediaRouter.selectRoute(mMediaRouter.getDefaultRoute());
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
            FlintManager.ConnectionCallbacks {
        @Override
        public void onConnectionSuspended(int cause) {
            Log.d(TAG, "ConnectionCallbacks.onConnectionSuspended");
        }

        @Override
        public void onConnected(Bundle connectionHint) {
            Log.d(TAG, "ConnectionCallbacks.onConnected");
            Flint.FlintApi.launchApplication(mApiClient, getAppUrl())
                    .setResultCallback(new ConnectionResultCallback());
        }

        @Override
        public void onConnectionFailed(ConnectionResult result) {
            Log.d(TAG, "ConnectionCallbacks.onConnectionFailed");
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
                Log.d(TAG, "ConnectionResultCallback: " + appMetaData.getData());
                try {
                    Flint.FlintApi.setMessageReceivedCallbacks(mApiClient,
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
