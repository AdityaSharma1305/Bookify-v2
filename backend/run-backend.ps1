$env:JAVA_HOME = "C:\Program Files\Java\jdk-22"
$env:PATH = "C:\Program Files\Java\jdk-22\bin;" + $env:PATH
$mvn = "C:\Users\babli\.vscode\extensions\oracle.oracle-java-26.0.1\nbcode\java\maven\bin\mvn.cmd"
Write-Host "Starting Bookify Backend with JDK 22 + Maven 3.9.15..." -ForegroundColor Green
& $mvn spring-boot:run
