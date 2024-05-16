# Função para enviar dados para o Firestore, sem verificar registros duplicados.
def upload_to_firestore(client, collection_name, df, transform_function):

    # Define a collection
    collection_ref = client.collection(collection_name)

    # Inicia um batch
    batch = client.batch()
    records = df.to_dict(orient="records")
    count = 0

    for index, record in enumerate(records):
        try:
            # Aplica a função de transformação fornecida a cada registro
            transformed_data = transform_function(record)

            # Cria um novo documento de referência
            new_document_ref = collection_ref.document()

            # Define o ID do documento
            document_id = new_document_ref.id

            # Seta o id gerado para o documento na propriadade Id do registro
            transformed_data.set_id(document_id)

            # Adiciona o documento ao batch
            batch.set(new_document_ref, transformed_data.to_dict())
            count += 1

            # Logging
            print(f"document_id: {document_id}, document_data: {transformed_data}")

            # Compromete em lotes de 500
            if count % 500 == 0 or index == len(records) - 1:
                batch.commit()
                print(f"Batch of {min(count, 500)} successfully pushed to Firestore.")
                batch = client.batch()
                count = 0

        except Exception as e:
            print(f"Error sending batch: {e}")


# Função para enviar dados para o Firestore, verificando se há registros duplicados antes de enviar.
def upload_to_firestore_checking_duplicated(client, collection_name, df, transform_function, duplicated_checker_function):

    # Filtra os registros duplicados
    df_filtered = duplicated_checker_function(client, collection_name, df)

    # Define a collection
    collection_ref = client.collection(collection_name)

    # Inicia um batch
    batch = client.batch()
    records = df_filtered.to_dict(orient="records")
    count = 0

    for index, record in enumerate(records):
        try:
            # Aplica a função de transformação fornecida a cada registro
            transformed_data = transform_function(record)

            # Cria um novo documento de referência
            new_document_ref = collection_ref.document()

            # Define o ID do documento
            document_id = new_document_ref.id

            # Seta o id gerado para o documento na propriadade Id do registro
            transformed_data.set_id(document_id)

            # Adiciona o documento ao batch
            batch.set(new_document_ref, transformed_data.to_dict())
            count += 1

            # Logging
            print(f"document_id: {document_id}, document_data: {transformed_data}")

            # Compromete em lotes de 500
            if count % 500 == 0 or index == len(records) - 1:
                batch.commit()
                print(f"Batch of {min(count, 500)} successfully pushed to Firestore.")
                batch = client.batch()
                count = 0

        except Exception as e:
            print(f"Error sending batch: {e}")


# Função para atualizar um único documento no Firestore. O principal objetivo é acelerar o processo de ajustes pontuais.
def update_firestore_single_document(client, collection_name, field_key, field_value, update_dict):
    try:
        collection_ref = client.collection(collection_name)
        query = collection_ref.where(field_key, "==", field_value)
        results = query.stream()

        for doc in results:
            doc_ref = collection_ref.document(doc.id)
            doc_ref.update(update_dict)
            print(f"Document {doc.id} update.")
    except Exception as e:
        print(f"Error updating document: {e}")
