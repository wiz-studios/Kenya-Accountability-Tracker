$excel = 'D:\Wiz dev\KAT\Senators County Delegations as of 2nd December, 2025.xlsx'
$xl = New-Object -ComObject Excel.Application
$xl.Visible = $false
$wb = $xl.Workbooks.Open($excel)
$ws = $wb.Sheets(1)
$rows = $ws.UsedRange.Rows.Count
$cols = $ws.UsedRange.Columns.Count

for($r = 1; $r -le [Math]::Min($rows, 20); $r++) {
  for($c = 1; $c -le $cols; $c++) {
    $val = $ws.Cells($r, $c).Value2
    Write-Host $val -NoNewline
    if($c -lt $cols) { Write-Host '|' -NoNewline }
  }
  Write-Host ''
}
$wb.Close()
$xl.Quit()
