import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from "../src/database/firebaseconfig";
import Home from '../src/views/Home'; // ← AÑADE ESTO
import Productos from '../src/views/Productos';
import Clientes from '../src/views/Clientes';
import Promedio from '../src/views/Promedio';
import Usuarios from '../src/views/Usuarios';
import Login from '../src/components/Login';
import ProductosRealtime from '../src/views/ProductosRealtime';
import CalculadoraIMC from '../src/views/CalculadoraIMC';

const Stack = createStackNavigator();

const StackNavigator = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (initializing) setInitializing(false);
    });
    return unsubscribe;
  }, []);

  if (initializing) return null;

  const cerrarSesion = async () => {
    await signOut(auth);
  };

  return (
    <Stack.Navigator initialRouteName={user ? "Home" : "Login"}>
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      
      {/* Home es ahora la pantalla principal */}
      <Stack.Screen 
        name="Home" 
        options={{ headerShown: false }}
      >
        {props => <Home {...props} cerrarSesion={cerrarSesion} />}
      </Stack.Screen>

      <Stack.Screen name="Productos" component={Productos} options={{ title: "Productos" }} />
      <Stack.Screen name="Clientes" component={Clientes} options={{ title: "Clientes" }} />
      <Stack.Screen name="Usuarios" component={Usuarios} options={{ title: "Usuarios" }} />
      <Stack.Screen name="Promedio" component={Promedio} options={{ title: "Promedio" }} />
      <Stack.Screen name="ProductosRT" component={ProductosRealtime} options={{ title: "Productos Realtime" }} />
      <Stack.Screen name="CalcularIMC" component={CalculadoraIMC} options={{ title: "Calcular IMC" }} />
    </Stack.Navigator>
  );
};

export default StackNavigator;