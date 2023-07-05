# Code snippets

## Ng serve 
```
ng serve --configuration=production
```
## Docker image build 
```
docker image build -t frontend .
```
## Docker push
```
docker tag frontend dariotintore/frontend
docker push dariotintore/frontend
```

## Electron run
```
npm run electron
```

## Electron build
```
electron-packager .
```

## Sonarqube scanner
```
sonar-scanner \
  -Dsonar.projectKey=Tesi-user-service \
  -Dsonar.sources=. \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.token=sqp_4a1001be363e8d5cbf4c6569b0dd85a6798b8481
```

