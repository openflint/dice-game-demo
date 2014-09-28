/*
 * Copyright (C) 2013-2014, Infthink (Beijing) Technology Co., Ltd. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.infthink.fling.demo.dice;

import tv.matchstick.fling.Fling;
import android.content.Context;
import android.content.pm.ActivityInfo;
import android.content.res.Configuration;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.support.v7.app.ActionBar;
import android.support.v7.app.ActionBarActivity;
import android.view.Menu;

public class DiceActivity extends ActionBarActivity implements
        SensorEventListener {

    private static final int SPEED_SHRESHOLD = 3000;
    private static final int UPTATE_INTERVAL_TIME = 100;

    private static final int MSG_START = 0;
    private static final int MSG_STOP = 1;

    private static final String APP_ID = Fling.FlingApi
            .makeApplicationId("http://castapp.infthink.com/receiver/dice/index.html");

    private FlingDiceManager mFlingGameManager;

    private SensorManager mSensorManager;
    private Sensor mSensor;

    private long mLastUpdateTime;
    private float mLastX;
    private float mLastY;
    private float mLastZ;
    private boolean mIsStart = false;

    /**
     * Called when the activity is first created. Initializes the game with
     * necessary listeners for player interaction, and creates a new Fling
     * channel.
     */
    @Override
    public void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        setContentView(R.layout.game);

        ActionBar actionBar = getSupportActionBar();
        actionBar.setNavigationMode(ActionBar.NAVIGATION_MODE_STANDARD);
        actionBar.setIcon(R.drawable.icon);
        actionBar.setDisplayShowTitleEnabled(true);

        mSensorManager = (SensorManager) getSystemService(Context.SENSOR_SERVICE);
        if (mSensorManager != null) {
            mSensor = mSensorManager
                    .getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
        }

        mFlingGameManager = new FlingDiceManager(this, APP_ID);
    }

    /**
     * Called when the options menu is first created.
     */
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        super.onCreateOptionsMenu(menu);
        getMenuInflater().inflate(R.menu.main, menu);
        mFlingGameManager
                .addMediaRouterButton(menu, R.id.media_route_menu_item);
        return true;
    }

    /**
     * Called on application start. Using the previously selected Fling device,
     * attempts to begin a session using the application name TicTacToe.
     */
    @Override
    protected void onStart() {
        super.onStart();
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (mSensor != null) {
            mSensorManager.registerListener(this, mSensor,
                    SensorManager.SENSOR_DELAY_GAME);
        }
    }

    /**
     * Removes the activity from memory when the activity is paused.
     */
    @Override
    protected void onPause() {
        super.onPause();
        mSensorManager.unregisterListener(this);
    }

    /**
     * Attempts to end the current game session when the activity stops.
     */
    @Override
    protected void onStop() {
        super.onStop();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        mFlingGameManager.destroy();
    }

    /**
     * Returns the screen configuration to portrait mode whenever changed.
     */
    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
    }

    @Override
    public void onAccuracyChanged(Sensor arg0, int arg1) {

    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        long currentUpdateTime = System.currentTimeMillis();
        long timeInterval = currentUpdateTime - mLastUpdateTime;
        if (timeInterval < UPTATE_INTERVAL_TIME)
            return;

        mLastUpdateTime = currentUpdateTime;
        float x = event.values[0];
        float y = event.values[1];
        float z = event.values[2];
        float deltaX = x - mLastX;
        float deltaY = y - mLastY;
        float deltaZ = z - mLastZ;
        mLastX = x;
        mLastY = y;
        mLastZ = z;
        double speed = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ
                * deltaZ)
                / timeInterval * 10000;
        if (speed >= SPEED_SHRESHOLD) {
            if (!mIsStart) {
                mIsStart = true;
                mHandler.sendEmptyMessage(MSG_START);
                mHandler.sendEmptyMessageDelayed(MSG_STOP, 5000);
            }
        }
    }

    private Handler mHandler = new Handler() {

        @Override
        public void handleMessage(Message msg) {
            super.handleMessage(msg);
            switch (msg.what) {
            case MSG_START:
                if (mFlingGameManager != null)
                    mFlingGameManager.startShake();
                break;
            case MSG_STOP:
                mIsStart = false;
                if (mFlingGameManager != null)
                    mFlingGameManager.stopShake();
                break;
            }
        }
    };

}
