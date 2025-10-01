import { createStackNavigator } from '@react-navigation/stack';
import Productos from '../src/views/Productos';
import Clientes from '../src/views/Clientes';

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Productos">
      <Stack.Screen name="Productos" component={Productos} />
      <Stack.Screen name="Clientes" component={Clientes} />
    </Stack.Navigator>
  );
};

export default StackNavigator;