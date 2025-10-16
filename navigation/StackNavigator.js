import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../src/database/firebaseconfig'; // Ajusta la ruta
import Productos from '../src/views/Productos';
import Clientes from '../src/views/Clientes';
import Promedio from '../src/views/Promedio';
import Usuarios from '../src/views/Usuarios';
import Login from '../src/components/Login';

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

  if (initializing) {
    return null; // O un componente de carga si prefieres
  }

  const cerrarSesion = async () => {
    try {
      await signOut(auth);
      console.log("Sesión cerrada");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <Stack.Navigator initialRouteName={user ? "Productos" : "Login"}>
      <Stack.Screen 
        name="Login" 
        component={(props) => <Login {...props} onLoginSuccess={() => props.navigation.navigate('Productos')} />}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Productos" 
        component={(props) => <Productos {...props} cerrarSesion={cerrarSesion} />}
      />
      <Stack.Screen name="Clientes" component={Clientes} />
      <Stack.Screen name="Promedio" component={Promedio} />
      <Stack.Screen name="Usuarios" component={Usuarios} />
    </Stack.Navigator>
  );
};

export default StackNavigator;