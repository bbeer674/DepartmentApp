import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {DEPARTMENT_SCREEN_SCENE} from './Constants';
import Department from './src/scenes/Department';
import DepartmentService from './src/services/DepartmentService';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}>
        <Stack.Screen
          name={DEPARTMENT_SCREEN_SCENE}
          component={(props: any) => (
            <Department {...props} departmentService={DepartmentService} />
          )}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
