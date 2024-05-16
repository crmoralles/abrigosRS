import sys


def data_partitioner(data, batch_size):
    """Gera um batch de dados de tamanho batch_size de uma lista de dados."""
    for i in range(0, len(data), batch_size):
        yield data[i : i + batch_size].tolist()


def query_batch(client, collection_name, data, field, operator, batch_size):
    """Realiza uma query batch e retorna um dic o id dos registros encontrados."""
    try:
        results = {}
        for rows in data_partitioner(data[field], batch_size):
            query = client.collection(collection_name).where(field, operator, rows)
            snapshot = query.get()
            found_data = {doc.to_dict().get(field): doc.id for doc in snapshot}
            for prop in rows:
                results[prop] = found_data.get(prop, None)

        return results
    except Exception as e:
        sys.exit(f"Erro ao realizar a query batch: {e}")
