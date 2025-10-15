import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, Platform, StyleSheet } from "react-native";
import { db } from "../components/firebaseConnections";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";

export default function CadastroScreen({ navigation, route }) {
  const produtoParaEditar = route.params?.produto || null;

  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [descricao, setDescricao] = useState("");

  // 🔹 Preenche os campos automaticamente se for edição
  useEffect(() => {
    if (produtoParaEditar) {
      setNome(produtoParaEditar.nome || "");
      // Garante que o preço seja uma string para o TextInput
      setPreco(produtoParaEditar.preco?.toString() || ""); 
      setDescricao(produtoParaEditar.descricao || "");
    }
  }, [produtoParaEditar]);

  // 🔹 Salvar ou atualizar produto
// ...
// 🔹 Salvar ou atualizar produto
const salvarProduto = async () => {
    // 💥 Validação: Verifica se nome e preço estão preenchidos
    if (!nome || !preco) {
        if (Platform.OS === "web") {
            window.alert("⚠️ Preencha o nome e o preço do produto!");
        } else {
            Alert.alert("Atenção", "⚠️ Preencha o nome e o preço do produto!");
        }
        return;
    }
    
    // Converte o preço
    const precoNumerico = parseFloat(preco.replace(",", "."));
    if (isNaN(precoNumerico)) {
        if (Platform.OS === "web") {
            window.alert("⚠️ Preço inválido!");
        } else {
            Alert.alert("Atenção", "⚠️ O valor do preço é inválido!");
        }
        return;
    }


    try {
        const mensagemSucesso = produtoParaEditar ? "✅ Produto atualizado com sucesso!" : "🆕 Produto adicionado com sucesso!";
        
        if (produtoParaEditar) {
            // 🔸 Atualiza produto existente
            const produtoRef = doc(db, "produtos", produtoParaEditar.id);
            await updateDoc(produtoRef, { nome, preco: precoNumerico, descricao });

        } else {
            // 🔸 Adiciona novo produto
            await addDoc(collection(db, "produtos"), { nome, preco: precoNumerico, descricao });
        }

        // --- BLOCO DE EXIBIÇÃO DE ALERTA CORRIGIDO ---
        if (Platform.OS === "web") {
            // No web, alertamos e navegamos. O window.alert é modal e trava a execução.
            window.alert(mensagemSucesso);
            navigation.goBack(); 
        } else {
            // No mobile, navegamos APENAS dentro do callback do botão OK do Alert.
            Alert.alert("Sucesso", mensagemSucesso, [
                {
                    text: "OK",
                    onPress: () => navigation.goBack(),
                },
            ]);
        }
        // --- FIM DO BLOCO DE ALERTA CORRIGIDO ---

    } catch (error) {
        console.error("Erro ao salvar:", error);
        if (Platform.OS === "web") {
            window.alert("❌ Falha ao salvar o produto! Verifique o console.");
        } else {
            Alert.alert("Erro", "❌ Falha ao salvar o produto!");
        }
    }
};
// ... (o restante do componente é o mesmo)


  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        {produtoParaEditar ? "Editar Produto" : "Cadastrar Produto"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do produto"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="Preço"
        keyboardType="numeric"
        value={preco}
        onChangeText={setPreco}
      />

      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        multiline
      />

      <Button
        title={produtoParaEditar ? "Salvar Alterações" : "Cadastrar"}
        onPress={salvarProduto}
        color={produtoParaEditar ? "#1E90FF" : "#228B22"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});