import React from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { collection, doc, addDoc } from "firebase/firestore";

const FormularioProductos = ({ nuevoProducto, manejoCambio, guardarProducto, modoEdicion, actualizarProducto }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        {modoEdicion ? "Edición de Productos" : "Registro de Productos"}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del producto"
        value={nuevoProducto.nombre}
        onChangeText={(nombre) => manejoCambio("nombre", nombre)}
      />
      <TextInput
        style={styles.input}
        placeholder="Precio"
        value={nuevoProducto.precio}
        onChangeText={(precio) => manejoCambio("precio", precio)}
        keyboardType="numeric"
      />
      <Button
        title={modoEdicion ? "Actualizar" : "Guardar"}
        onPress={modoEdicion ? () => actualizarProducto() : () => guardarProducto()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10 }
});

export default FormularioProductos;