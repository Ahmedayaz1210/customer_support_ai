from http.server import BaseHTTPRequestHandler
from main import app
from mangum import Mangum

handler = Mangum(app)

class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/api/chat':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            response = handler({"body": post_data, "httpMethod": "POST"})
            self.send_response(response['statusCode'])
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(response['body'].encode())
        else:
            self.send_response(404)
            self.end_headers()