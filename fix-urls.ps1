# Fix image URLs in index.html
$content = Get-Content index.html -Raw
$content = $content -replace 'Asır Group - We Supply Your Growth_files', 'assets'
Set-Content index.html $content
Write-Host "All image URLs have been updated to use ./assets/ path"
