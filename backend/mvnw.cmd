@REM Maven Wrapper startup batch script
@IF "%JAVA_HOME%"=="" (
    @IF EXIST "C:\Program Files\Java\jdk-22\bin\java.exe" (
        @SET "JAVA_HOME=C:\Program Files\Java\jdk-22"
    )
)

@SET JAVA_EXE="%JAVA_HOME%\bin\java.exe"
@IF NOT EXIST %JAVA_EXE% (
    @ECHO Error: JAVA_HOME is not set. Trying system java...
    @SET JAVA_EXE=java
)

@SET "WRAPPER_JAR=%~dp0.mvn\wrapper\maven-wrapper.jar"
@SET "WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain"

@IF NOT EXIST "%~dp0.mvn\wrapper\maven-wrapper.jar" (
    @ECHO Downloading Maven Wrapper JAR...
    @powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object System.Net.WebClient).DownloadFile('https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.3.2/maven-wrapper-3.3.2.jar', '%~dp0.mvn\wrapper\maven-wrapper.jar')"
)

@%JAVA_EXE% -classpath "%~dp0.mvn\wrapper\maven-wrapper.jar" ^
  "-Dmaven.multiModuleProjectDirectory=%~dp0" ^
  %WRAPPER_LAUNCHER% %*
