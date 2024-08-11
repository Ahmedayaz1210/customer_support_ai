import os
import requests
from bs4 import BeautifulSoup


from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema.document import Document

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    length_function=len,
    separators=["\n\n", "\n", " ", ""],
)

def get_docs(urls):
    documents = []
    for url in urls:
        response = requests.get(url)

        # Check if the request was successful
        if response.status_code == 200:
            html_content = response.text
        else:
            raise Exception("Failed to retrieve the webpage")

        # Create a BeautifulSoup object and specify the parser
        soup = BeautifulSoup(html_content, 'html.parser')

        # Extract text from the HTML (you can customize this to extract specific tags)
        text = soup.get_text(strip=True)


        # Convert text to langchain Document
        docs = Document(page_content=text, metadata={"source":url})

        documents.append(docs)

    doc_chunks = text_splitter.split_documents(documents)
    
    return doc_chunks


if __name__ == "__main__":
    docs = get_docs(["https://api.python.langchain.com/en/latest/document_loaders/langchain_community.document_loaders.chromium.AsyncChromiumLoader.html"])
    print(docs[0].page_content)
    print(len(docs))