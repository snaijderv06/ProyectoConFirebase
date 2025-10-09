import { createStackNavigator } from '@react-navigation/stack';
import Productos from '../src/views/Productos';
import Clientes from '../src/views/Clientes';
import Promedio from '../src/views/Promedio';

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Productos">
      <Stack.Screen name="Productos" component={Productos} />
      <Stack.Screen name="Clientes" component={Clientes} />
      <Stack.Screen name="Promedio" component={Promedio} />
    </Stack.Navigator>
  );
};

export default StackNavigator;