
package com.doomshell.aapkepass;

import androidx.annotation.NonNull;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.ArrayList;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.bridge.JavaScriptModule;
public class RNVoipCallPackage implements ReactPackage {
    
  @NonNull
  @Override
     public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
       return Collections.emptyList();
   }

    @NonNull
    @Override
   public List<NativeModule> createNativeModules(
            @NonNull ReactApplicationContext reactContext) {
       List<NativeModule> modules = new ArrayList<>();

       modules.add(new RNVoipCallModule(reactContext));

       return modules;
   }

}