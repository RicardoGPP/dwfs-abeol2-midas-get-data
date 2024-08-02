# Midas - Get data

Este projeto faz parte do trabalho da disciplina de Arquitetura de Backend do curso de pós-graduação em Desenvolvimento Web FullStack da PUC Minas. Trata de uma função lambda acessível por uma API Gateway capaz receber o nome de um produto e uma latitude e longitude e retornar o preço deste produto em diversos supermercados em um raio de 7 km. Esta é a última etapa do fluxo empregado pelo [scraper](https://github.com/RicardoGPP/dwfs-abeol2-midas-scrapper-lambda) e [save-data](https://github.com/RicardoGPP/dwfs-abeol2-midas-save-data-lambda).

## Principais arquivos do projeto

 - [template.yaml](https://github.com/RicardoGPP/dwfs-abeol2-midas-get-data-lambda/blob/main/template.yaml): Descreve os recursos a serem provisionados na AWS;
 - [app.mjs](https://github.com/RicardoGPP/dwfs-abeol2-midas-get-data-lambda/blob/main/app/app.mjs): Faz a tratativa de eventos/requisições de get-data;
 - [knexfile.mjs](https://github.com/RicardoGPP/dwfs-abeol2-midas-get-data-lambda/blob/main/app/knexfile.js): Contém a configuração necessária para a conexão com o banco de dados;
 - [geolocalization-price-repository.mjs](https://github.com/RicardoGPP/dwfs-abeol2-midas-get-data-lambda/blob/main/app/src/repository/geolocalization-price-repository.mjs): Repositório de preços geolocalizados.

## Funcionamento

A busca dos preços é realizada no banco de dados fazendo a junção das tabelas `price`, `product` e `supermarket`. Foi aplicado um filtro para que apenas supermercados que estejam em um raio de 7 km sejam considerados. Também foi aplicado um filtro que seleciona apenas o preço mais recente para o produto buscado em meio ao histórico cadastrado.

Para interagir com a aplicação, basta realizar uma requisição GET para o seguinte endereço respeitando o formato abaixo:

```
https://${ServerlessRestApi}.execute-api.${AWS::Region}.amazonaws.com/Prod/prices?name=<product-name>&latlng=<latitude>&latlng=<longitude>
```

Se tudo correu bem, a resposta da requisição deverá ser similar à:

```
{
  "BANANAPRATAESP. kg": {
    "DMA DISTRIBUIDORA S/A": {
      "price": "2.96",
      "address": {
        "street": "AV. MIGUEL PERRELA",
        "number": "000987",
        "neighborhood": "CASTELO",
        "zipCode": "3106200",
        "city": "BELO HORIZONTE",
        "state": "MG",
        "latitude": "-19.910183",
        "longitude": "-43.926572"
      }
    },
    [...]
  },
  [...]
}
```

## Diagrama relacional do banco de dados

![Midas - Diagrama relacional](https://github.com/user-attachments/assets/4c5fd71a-7e5a-42c8-beae-865e805ae84a)
