# http://images.azk.io

## English Version

Azuki images repository to `azk`: [http://images.azk.io](http://images.azk.io)

### Installation

Install AZK

  [http://docs.azk.io/en/installation/](http://docs.azk.io/en/installation/)

Install assets with Bower:

  ```bash
  azk nvm bower install
  ```
  
Start project:

  ```bash
  azk nvm gulp default
  azk start --open
  ```
  
For development:

  ```bash
  azk nvm gulp watch
  ```
  
Logs:

  ```bash
  azk logs --tail
  ```

### Deploy

Set `AWS_ACCESS_KEY_ID`, `AWS_SECRET_KEY` and `AWS_BUCKET` keys in local `.env` file and run:

  ```bash
  $ azk shell -c 'gulp deploy'
  ```

## Portuguese Version

Repositório de imagens do Azuki para o  `azk`: [http://images.azk.io](http://images.azk.io)

### Instalação

Instale o `azk`

  [http://docs.azk.io/pt-BR/installation/](http://docs.azk.io/pt-BR/installation/)


Instale assets via Bower:

  ```bash
  azk nvm bower install
  ```
  
Inicie o projeto:

  ```bash
  azk nvm gulp default
  azk start --open
  ```
  
Para desenvolvimento:

  ```bash
  azk nvm gulp watch
  ```
  

Logs:

  ```bash
  azk logs --tail
  ```

### Deploy

Adicione as chaves `AWS_ACCESS_KEY_ID`, `AWS_SECRET_KEY` e `AWS_BUCKET` no arquivo local `.env` e depois execute:

  ```bash
  $ azk shell -c 'gulp deploy'
  ```

## License

"Azuki", "Azk" and the Azuki logo are copyright (c) 2013-2015 Azuki Serviços de Internet LTDA.

Azk source code is released under Apache 2 License.

Check LEGAL and LICENSE files for more information.
