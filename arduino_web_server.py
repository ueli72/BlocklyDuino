#!/usr/bin/python
# -*- coding: utf-8 -*-
#
# credit: http://sheep.art.pl/Wiki%20Engine%20in%20Python%20from%20Scratch


import http.server
import itertools
import logging
import platform
import os
import re
import subprocess
import tempfile
import urllib.parse
from optparse import OptionParser


logging.basicConfig(level=logging.DEBUG)


arduino_cmd = None
def get_arduino_command():
    """Attempt to find or guess the path to the Arduino binary."""
    global arduino_cmd
    if not arduino_cmd:
        if platform.system() == "Darwin":
            arduino_cmd_guesses = ["/Applications/Arduino.app/Contents/MacOS/Arduino"]
        elif platform.system() == "Windows":
            arduino_cmd_guesses = [
                r"c:\Program Files\Arduino\Arduino_debug.exe",
                r"c:\Program Files\Arduino\Arduino.exe",
                r"c:\Program Files (x86)\Arduino\Arduino_debug.exe",
                r"c:\Program Files (x86)\Arduino\Arduino.exe"
            ]
        else:
            arduino_cmd_guesses = []

        for guess in arduino_cmd_guesses:
            if os.path.exists(guess):
                logging.info("Found Arduino command at %s", guess)
                arduino_cmd = guess
                break
        else:
            logging.info("Couldn't find Arduino command; hoping it's on the path!")
            arduino_cmd = "arduino"
    return arduino_cmd


def guess_port_name():
    """Attempt to guess a port name that we might find an Arduino on."""
    portname = None
    if platform.system() == "Windows":
        import winreg
        key = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, r"HARDWARE\DEVICEMAP\SERIALCOMM")
        # We'll guess it's the last COM port.
        for i in itertools.count():
            try:
                portname = winreg.EnumValue(key, i)[1]
            except OSError:
                break
    else:
        # We'll guess it's the first non-bluetooth tty. or cu. prefixed device
        ttys = [filename for filename in os.listdir("/dev")
                if (filename.startswith("tty.") or filename.startswith("cu."))
                and not "luetooth" in filename]
        ttys.sort(key=lambda k:(k.startswith("cu."), k))
        if ttys:
            portname = "/dev/" + ttys[0]
    logging.info("Guessing port name as %s", portname)
    return portname


parser = OptionParser()
parser.add_option("--port", dest="port", help="Upload to serial port named PORT", metavar="PORT")
parser.add_option("--board", dest="board", help="Board definition to use", metavar="BOARD")
parser.add_option("--command", dest="cmd", help="Arduino command name", metavar="CMD")


class Handler(http.server.SimpleHTTPRequestHandler):
    def do_HEAD(self):
        """Send response headers"""
        if self.path != "/":
            return http.server.SimpleHTTPRequestHandler.do_HEAD(self)
        self.send_response(200)
        self.send_header("content-type", "text/html;charset=utf-8")
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

    def do_GET(self):
        """Send page text"""
        if self.path == "/":
            self.send_response(302)
            self.send_header("Location", "/blockly/apps/blocklyduino/index.html")
            self.end_headers()
        elif self.path == "/template/esp32-s3-devkitc1":
            self.serve_template("esp32-s3-devkitc1")
        elif self.path == "/template/arduino-uno":
            self.serve_template("arduino-uno")
        else:
            return http.server.SimpleHTTPRequestHandler.do_GET(self)

    def serve_template(self, board_id):
        """Serve template files for a board as JSON"""
        template_dir = os.path.join(os.path.dirname(__file__), "boards", board_id)
        if not os.path.exists(template_dir):
            self.send_response(404)
            self.end_headers()
            return

        import json
        files = {}
        for root, dirs, filenames in os.walk(template_dir):
            for filename in filenames:
                filepath = os.path.join(root, filename)
                relpath = os.path.relpath(filepath, template_dir)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        files[relpath] = f.read()
                except:
                    pass

        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(files).encode('utf-8'))

    def do_POST(self):
        """Save new page text and display it"""
        if self.path != "/":
            return http.server.SimpleHTTPRequestHandler.do_POST(self)

        options, args = parser.parse_args()

        length = int(self.headers.get('content-length', 0))
        if length:
            text = self.rfile.read(length).decode('utf-8')
                        
            print("sketch to upload: " + text)

            dirname = tempfile.mkdtemp()
            sketchname = os.path.join(dirname, os.path.basename(dirname)) + ".ino"
            f = open(sketchname, "wb")
            f.write(text + "\n")
            f.close()

            print("created sketch at %s" % (sketchname,))
        
            # invoke arduino to build/upload
            compile_args = [
                options.cmd or get_arduino_command(),
                "--upload",
                "--port",
                options.port or guess_port_name(),
            ]
            if options.board:
                compile_args.extend([
                    "--board",
                    options.board
                ])
            compile_args.append(sketchname)

            print("Uploading with %s" % (" ".join(compile_args)))
            rc = subprocess.call(compile_args)

            if not rc == 0:
                print("arduino --upload returned " + str(rc))                            
                self.send_response(400)
            else:
                self.send_response(200)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
        else:
            self.send_response(400)


if __name__ == '__main__':
    print("Blocklyduino can now be accessed at http://127.0.0.1:8080/")
    server = http.server.HTTPServer(("127.0.0.1", 8080), Handler)
    server.serve_forever()
