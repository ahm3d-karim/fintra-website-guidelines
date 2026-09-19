"""Range-capable static server for the scrub demo.

`python -m http.server` answers without Accept-Ranges, so a browser never marks
the video seekable and setting currentTime does nothing. Any real host
(Cloudflare, nginx, S3) sends byte ranges; this fills the same gap locally.

Run:  python docs/demo/serve-range.py 8391
"""
import os
import re
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

RANGE = re.compile(r"bytes=(\d*)-(\d*)")


class Handler(SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"
    _remaining = None

    def end_headers(self):
        self.send_header("Accept-Ranges", "bytes")
        # No caching while editing: heuristic caching made a fixed page keep serving its old
        # markup and read as a bug. Real hosts set their own headers.
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def send_head(self):
        rng = self.headers.get("Range")
        path = self.translate_path(self.path)
        if not rng or not os.path.isfile(path):
            return super().send_head()
        m = RANGE.fullmatch(rng.strip())
        if not m:
            return super().send_head()
        size = os.path.getsize(path)
        start = int(m.group(1)) if m.group(1) else max(0, size - int(m.group(2) or 0))
        end = int(m.group(2)) if m.group(1) and m.group(2) else size - 1
        end = min(end, size - 1)
        if start > end:
            self.send_error(416)
            return None
        self._remaining = end - start + 1
        self.send_response(206)
        self.send_header("Content-Type", self.guess_type(path))
        self.send_header("Content-Range", "bytes %d-%d/%d" % (start, end, size))
        self.send_header("Content-Length", str(self._remaining))
        self.end_headers()
        f = open(path, "rb")
        f.seek(start)
        return f

    def copyfile(self, source, outputfile):
        left = self._remaining
        if left is None:
            try:
                return super().copyfile(source, outputfile)
            except (ConnectionResetError, BrokenPipeError):
                return          # a browser aborting a video request is not an error
        try:
            while left > 0:
                chunk = source.read(min(65536, left))
                if not chunk:
                    break
                outputfile.write(chunk)
                left -= len(chunk)
        except (ConnectionResetError, BrokenPipeError):
            pass                # seeked away mid-range: expected, and the thread ends quietly
        self._remaining = None


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8391
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    # allow_reuse_address (the stdlib default) lets a second instance bind the same port on
    # Windows and shadow the first, which reads as a server serving stale files. Off, so a
    # second start fails loudly instead.
    ThreadingHTTPServer.allow_reuse_address = False
    print("serving %s on http://127.0.0.1:%d/ (range capable, no-store)" % (os.getcwd(), port), flush=True)
    ThreadingHTTPServer(("127.0.0.1", port), Handler).serve_forever()
