import os
import shutil

import chromadb
from langchain.vectorstores import Chroma
from langchain.document_loaders import PyPDFLoader

from ml_utils.doc_embedding import get_langchain_embeddings
from ml_utils.data_handler import get_docs


class RAG:
    def __init__(self, db_filepath, collection_name) -> None:
        
        self.urls = []

        self.vector_store = Chroma(
            collection_name=collection_name,
            embedding_function = get_langchain_embeddings(),
            persist_directory = db_filepath
        )
        pass
    
    def add_url(self, url):
        doc_splits = get_docs([url])
        # check if the url already exists in the vector store
        #  “ids”, “embeddings”, “metadatas”, “documents”.
        db_data = self.vector_store.get(include=['metadatas'])
        for metadata in db_data['metadatas']:
            if metadata['source'] == doc_splits[0].metadata['source']:
                print(f"Skipping {doc_splits[0].metadata['source']} as it already exists in the vector store")
                return

        self.vector_store.add_documents(doc_splits)
        self.urls.append(url)
    
    def search(self, query, top_k = 3):
        return self.vector_store.max_marginal_relevance_search(query,k=top_k)

    def get_context(self, query):
        docs = self.search(query, top_k=1)
        return docs[0].page_content
    
    

    
    