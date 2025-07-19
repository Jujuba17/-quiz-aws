import json
import pandas as pd
import re

# Abrir o arquivo JSON
with open("questions.json", "r", encoding="utf-8") as f:
    perguntas = json.load(f)

# Função para remover HTML como <div>
def limpar_html(texto):
    return re.sub(r"<.*?>", "", texto).strip()

# Montar os dados
dados = []
for item in perguntas:
    linha = {
        "question": limpar_html(item["question"]),
    }
    for i, resposta in enumerate(item["answers"]):
        linha[f"answer_{i+1}"] = resposta
    dados.append(linha)

# Criar DataFrame
df = pd.DataFrame(dados)

# Salvar como arquivo Excel (.xlsx)
df.to_excel("questions_basico.xlsx", index=False)
