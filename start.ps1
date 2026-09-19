param([switch]$NoBrowser,[int]$Port=8765)
$ErrorActionPreference = 'Stop'
$siteRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot 'dist'))
if (-not (Test-Path -LiteralPath (Join-Path $siteRoot 'index.html'))) { throw 'Missing dist/index.html. Use the complete release package.' }
$port = $Port
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://127.0.0.1:$port/")
try { $listener.Start() } catch {
  try {
    $response = Invoke-WebRequest "http://127.0.0.1:$port/" -UseBasicParsing -TimeoutSec 2
    if ($response.StatusCode -eq 200) {
      Write-Host "Sunseeker is already running: http://127.0.0.1:$port/" -ForegroundColor Yellow
      if (-not $NoBrowser) { Start-Process "http://127.0.0.1:$port/" }
      return
    }
  } catch { throw 'Could not start the local server on the selected port.' }
}
Write-Host "Sunseeker vocabulary quiz: http://127.0.0.1:$port/" -ForegroundColor Yellow
Write-Host 'Press Ctrl+C to stop. Lessons are stored in this browser.'
if (-not $NoBrowser) { Start-Process "http://127.0.0.1:$port/" }
$mime = @{'.html'='text/html; charset=utf-8';'.js'='text/javascript; charset=utf-8';'.mjs'='text/javascript; charset=utf-8';'.css'='text/css; charset=utf-8';'.json'='application/json; charset=utf-8';'.png'='image/png';'.jpg'='image/jpeg';'.svg'='image/svg+xml';'.wasm'='application/wasm'}
try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    try {
      $relative = [Uri]::UnescapeDataString($context.Request.Url.AbsolutePath).TrimStart('/')
      if (-not $relative) { $relative = 'index.html' }
      $target = [System.IO.Path]::GetFullPath((Join-Path $siteRoot $relative))
      if (-not $target.StartsWith($siteRoot + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase)) { $context.Response.StatusCode = 403; continue }
      if (-not (Test-Path -LiteralPath $target -PathType Leaf)) { $context.Response.StatusCode = 404; continue }
      $ext = [System.IO.Path]::GetExtension($target).ToLowerInvariant()
      $context.Response.ContentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' }
      $bytes = [System.IO.File]::ReadAllBytes($target)
      $context.Response.ContentLength64 = $bytes.Length
      $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } catch { $context.Response.StatusCode = 500 } finally { $context.Response.Close() }
  }
} finally { $listener.Stop(); $listener.Close() }
