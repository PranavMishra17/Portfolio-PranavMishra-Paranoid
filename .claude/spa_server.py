"""Static server with SPA fallback, for previewing the built portfolio. Dev tool only."""
import os, sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = sys.argv[2] if len(sys.argv) > 2 else "."
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 4600

class SPA(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)
    def send_head(self):
        path = self.translate_path(self.path)
        if not os.path.exists(path) and "." not in os.path.basename(path):
            self.path = "/index.html"
        return super().send_head()
    def log_message(self, *a):
        pass

ThreadingHTTPServer(("127.0.0.1", PORT), SPA).serve_forever()
