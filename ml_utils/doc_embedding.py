"""
We will using hugging face embedding model (all-MiniLM-L6-v2) to embed our documents.
https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2
After embedding those models we can use reranking to rank our documents, after query search and retrieval few similar documents.
For reranking we use jina (https://huggingface.co/jinaai/jina-reranker-v1-turbo-en) hugging face model.
"""

from sentence_transformers import SentenceTransformer

from langchain_huggingface import HuggingFaceEmbeddings


def get_embeddings(texts, model="all-MiniLM-L6-v2"):
    model = SentenceTransformer(f"sentence-transformers/{model}")  # or any other pretrained model
    embeddings = model.encode(texts, show_progress_bar=True)
    return embeddings

def get_langchain_embeddings(model="all-MiniLM-L6-v2"):
    """
    It will be helpful when using langchain vector database
    https://api.python.langchain.com/en/latest/embeddings/langchain_huggingface.embeddings.huggingface.HuggingFaceEmbeddings.html
    """
    model_name = f"sentence-transformers/{model}"
    return HuggingFaceEmbeddings(model_name=model_name)

if __name__ == "__main__":
    texts = ["This is an example sentence", "Each sentence is converted"]

    embeddings = get_embeddings(texts)
    print(type(embeddings[0]),embeddings[0].shape)