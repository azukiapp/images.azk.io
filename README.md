# Images

Este é o código fonte para a aplicação [http://images.azk.io](http://images.azk.io).

Esta aplicação é deploiada como uma aplicação frontend, e utiliza dados do https://github.com em tempo real.

## Rodando localmente

Para o seu desenvolvimento você pode usar as duas opções a baixo, dando preferencia para opção que utiliza o http://azk.io:

### with azk

```sh
# clean all persistent folder before run
sudo rm -rf node_modules build

# start azk and logs
azk restart -R -vv && azk logs --follow
```

then, open http://images-dev.dev.azk.io on your browser

### without azk

```sh
# get back access for all your files
sudo chown `whoami` -R .

npm install
npm start
```

then, open http://localhost:3000 on your browser

## Deploying

Before deploying you must create a file named `.env` or copy and update `.env.sample`

```ini
UA_CODE=UA-XXXXXXXX-Y
AWS_ACCESS_KEY_ID=XXXXXXXXXXXXXX
AWS_SECRET_KEY=XXXXXXXXXXXXXXXXX
AWS_BUCKET_PROD=[bucket to prod deploy]
AWS_BUCKET_STAGE=[bucket to stage deploy]
```

Depois disso você pode fazer o deploy com:

```sh
azk shell -- gulp deploy --production
# or
azk shell -- gulp deploy --stage
```

## License

"Azuki", "azk" and the Azuki logo are copyright (c) 2013-2015 Azuki Serviços de Internet LTDA.

azk source code is released under the Apache 2 License.

Check LEGAL and LICENSE files for more information.
