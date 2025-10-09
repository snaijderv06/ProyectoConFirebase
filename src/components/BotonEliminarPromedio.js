import { useState } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";

const BotonEliminarPromedio = ({ id, eliminarPromedio }) => {
  const [visible, setVisible] = useState(false);
  const [confirmarEliminar, setConfirmarEliminar] = useState(false);

  return (
    <View>
      <TouchableOpacity
        style={styles.boton}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.textoBoton}>🗑</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.texto}>¿Desea eliminar este promedio?</Text>
            <TouchableOpacity
              style={styles.botonAccion}
              onPress={() => {
                setConfirmarEliminar(true);
                setVisible(false);
              }}
            >
              <Text style={styles.textoAccion}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.botonAccion, styles.confirmar]}
              onPress={() => {
                if (confirmarEliminar) {
                  eliminarPromedio(id);
                }
                setVisible(false);
              }}
            >
              <Text style={styles.textoAccion}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  boton: {
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#f3f3ff",
  },
  textoBoton: {
    color: "white",
    fontSize: 14,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    width: "80%",
    alignItems: "center",
    borderRadius: 10,
  },
  texto: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    width: "100%",
  },
  botonesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  botonAccion: {
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    minWidth: 100,
    backgroundColor: "#ccc",
    marginBottom: 10,
  },
  confirmar: {
    backgroundColor: "#ff4444",
  },
  textoAccion: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default BotonEliminarPromedio;