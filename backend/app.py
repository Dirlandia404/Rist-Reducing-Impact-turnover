from flask import Flask, request, jsonify
import optimization_script
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/optimize', methods=['POST'])
def optimize():
    data = request.json


    # Função para padronizar a tabela de agentes
    def standardize_agents_table(agents_table):
        if not agents_table or not any(agents_table):
            # Retornar um erro ou processar de outra forma
            raise ValueError("Received empty agents table")
        max_length = max(len(row) for row in agents_table)
        standardized_table = [row + [0] * (max_length - len(row)) for row in agents_table]
        return standardized_table

    try:
        # Padronizando as tabelas
        standardized_repository = standardize_agents_table(data['repository'])
        standardized_agents_table = standardize_agents_table(data['agents_table'])
        standardized_task_table = standardize_agents_table(data['task_table'])
        standardized_file_table= standardize_agents_table(data['file_table'])
        standardized_change_table= standardize_agents_table(data['change_table'])

        # Passando a tabela padronizada para a função main
        result = optimization_script.main(standardized_repository, standardized_agents_table, standardized_task_table, standardized_file_table, standardized_change_table)
    
        # Retorna o resultado incluindo a solução ótima e o resultado da avaliação
        return jsonify(result)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        app.logger.error(f"Erro inesperado: {e}")
        return jsonify({"error": "Ocorreu um erro inesperado"}), 500
    
if __name__ == '__main__':
    app.run(debug=True)
