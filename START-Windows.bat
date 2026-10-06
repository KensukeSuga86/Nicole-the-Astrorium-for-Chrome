@echo off
start "" chrome "%~dp0index.html" || echo Chrome not found. Open index.html in Chrome.
