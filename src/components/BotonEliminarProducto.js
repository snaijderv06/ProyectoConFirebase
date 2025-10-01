import { useState } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";

const BotonEliminarProducto = ({ id, eliminarProducto }) => {
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
            <Text style={styles.texto}>¿Desea eliminar este producto?</Text>
            <View style={styles.botonesContainer}>
              <TouchableOpacity
                style={[styles.botonAccion, styles.cancelar]}
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
                    eliminarProducto(id);
                  }
                  setVisible(false);
                }}
              >
                <Text style={styles.textoAccion}>Eliminar</Text>
              </TouchableOpacity>
            </View>
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
    padding: 20, // Aumenté el padding para dar más espacio
    width: "80%",
    alignItems: "center",
    borderRadius: 10, // Añadí borde redondeado para mejor apariencia
  },
  texto: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center", // Centré el texto para mejor legibilidad
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
    borderRadius: 5, // Borde redondeado para los botones
    minWidth: 100, // Ancho mínimo para asegurar visibilidad
  },
  cancelar: {
    backgroundColor: "#ccc",
  },
  confirmar: {
    backgroundColor: "#ff4444",
  },
  textoAccion: {
    color: "white", // Restauré a blanco para contrastar con los fondos
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default BotonEliminarProducto;