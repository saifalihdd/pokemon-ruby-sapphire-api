{
  "info": {
    "name": "Pokemon Ruby Sapphire API",
    "description": "Final Project Backend Basic. Jalankan folder secara berurutan (00 -> 04). Variabel pokemonId terisi otomatis oleh request Create.",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "00 - Server",
      "item": [
        {
          "name": "Root endpoint",
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test(\"Status code is 200\", function () { pm.response.to.have.status(200); });"
                ]
              }
            }
          ],
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/",
              "host": [
                "{{baseUrl}}"
              ],
              "path": []
            }
          }
        }
      ]
    },
    {
      "name": "01 - Create",
      "item": [
        {
          "name": "Create Pokemon (Treecko lv 10)",
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test(\"Status code is 201\", function () { pm.response.to.have.status(201); });",
                  "const json = pm.response.json();",
                  "pm.collectionVariables.set(\"pokemonId\", json.data._id);"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/pokemon",
              "host": [
                "{{baseUrl}}"
              ],
              "path": [
                "pokemon"
              ]
            },
            "body": {
              "mode": "raw",
              "raw": "{\n  \"speciesId\": 252,\n  \"level\": 10,\n  \"nickname\": \"Leafy\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            }
          }
        },
        {
          "name": "Create - species not found (400)",
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test(\"Status code is 400\", function () { pm.response.to.have.status(400); });"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/pokemon",
              "host": [
                "{{baseUrl}}"
              ],
              "path": [
                "pokemon"
              ]
            },
            "body": {
              "mode": "raw",
              "raw": "{\n  \"speciesId\": 99999\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            }
          }
        },
        {
          "name": "Create - invalid level (400)",
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test(\"Status code is 400\", function () { pm.response.to.have.status(400); });"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/pokemon",
              "host": [
                "{{baseUrl}}"
              ],
              "path": [
                "pokemon"
              ]
            },
            "body": {
              "mode": "raw",
              "raw": "{\n  \"speciesId\": 252,\n  \"level\": 150\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            }
          }
        },
        {
          "name": "Create - invalid nickname (400)",
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test(\"Status code is 400\", function () { pm.response.to.have.status(400); });"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/pokemon",
              "host": [
                "{{baseUrl}}"
              ],
              "path": [
                "pokemon"
              ]
            },
            "body": {
              "mode": "raw",
              "raw": "{\n  \"speciesId\": 252,\n  \"nickname\": \"Nama Terlalu Panjang Sekali\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            }
          }
        }
      ]
    },
    {
      "name": "02 - Read",
      "item": [
        {
          "name": "Get all Pokemon",
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test(\"Status code is 200\", function () { pm.response.to.have.status(200); });"
                ]
              }
            }
          ],
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/pokemon",
              "host": [
                "{{baseUrl}}"
              ],
              "path": [
                "pokemon"
              ]
            }
          }
        },
        {
          "name": "Query: filter type=Grass, sort=-level",
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test(\"Status code is 200\", function () { pm.response.to.have.status(200); });"
                ]
              }
            }
          ],
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/pokemon?type=Grass&sort=-level",
              "host": [
                "{{baseUrl}}"
              ],
              "path": [
                "pokemon"
              ],
              "query": [
                {
                  "key": "type",
                  "value": "Grass"
                },
                {
                  "key": "sort",
                  "value": "-level"
                }
              ]
            }
          }
        },
        {
          "name": "Query: search=tree",
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test(\"Status code is 200\", function () { pm.response.to.have.status(200); });"
                ]
              }
            }
          ],
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/pokemon?search=tree",
              "host": [
                "{{baseUrl}}"
              ],
              "path": [
                "pokemon"
              ],
              "query": [
                {
                  "key": "search",
                  "value": "tree"
                }
              ]
            }
          }
        },
        {
          "name": "Query: minLevel=5 & maxLevel=30",
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test(\"Status code is 200\", function () { pm.response.to.have.status(200); });"
                ]
              }
            }
          ],
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/pokemon?minLevel=5&maxLevel=30",
              "host": [
                "{{baseUrl}}"
              ],
              "path": [
                "pokemon"
              ],
              "query": [
                {
                  "key": "minLevel",
                  "value": "5"
                },
                {
                  "key": "maxLevel",
                  "value": "30"
                }
              ]
            }
          }
        },
        {
          "name": "Path param: get by id",
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test(\"Status code is 200\", function () { pm.response.to.have.status(200); });"
                ]
              }
            }
          ],
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/pokemon/{{pokemonId}}",
              "host": [
                "{{baseUrl}}"
              ],
              "path": [
                "pokemon",
                "{{pokemonId}}"
              ]
            }
          }
        },
        {
          "name": "Get by id - invalid format (400)",
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test(\"Status code is 400\", function () { pm.response.to.have.status(400); });"
                ]
              }
            }
          ],
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/pokemon/abc",
              "host": [
                "{{baseUrl}}"
              ],
              "path": [
                "pokemon",
                "abc"
              ]
            }
          }
        },
        {
          "name": "Get by id - not found (404)",
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test(\"Status code is 404\", function () { pm.response.to.have.status(404); });"
                ]
              }
            }
          ],
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/pokemon/64b0c0c0c0c0c0c0c0c0c0c0",
              "host": [
                "{{baseUrl}}"
              ],
              "path": [
                "pokemon",
                "64b0c0c0c0c0c0c0c0c0c0c0"
              ]
            }
          }
        }
      ]
    },
    {
      "name": "03 - Evolve & Update",
      "item": [
        {
          "name": "Evolve - level not enough (400)",
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test(\"Status code is 400\", function () { pm.response.to.have.status(400); });"
                ]
              }
            }
          ],
          "request": {
            "method": "PATCH",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/pokemon/{{pokemonId}}/evolve",
              "host": [
                "{{baseUrl}}"
              ],
              "path": [
                "pokemon",
                "{{pokemonId}}",
                "evolve"
              ]
            }
          }
        },
        {
          "name": "Update level to 20",
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test(\"Status code is 200\", function () { pm.response.to.have.status(200); });"
                ]
              }
            }
          ],
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/pokemon/{{pokemonId}}",
              "host": [
                "{{baseUrl}}"
              ],
              "path": [
                "pokemon",
                "{{pokemonId}}"
              ]
            },
            "body": {
              "mode": "raw",
              "raw": "{\n  \"level\": 20\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            }
          }
        },
        {
          "name": "Update nickname",
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test(\"Status code is 200\", function () { pm.response.to.have.status(200); });"
                ]
              }
            }
          ],
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/pokemon/{{pokemonId}}",
              "host": [
                "{{baseUrl}}"
              ],
              "path": [
                "pokemon",
                "{{pokemonId}}"
              ]
            },
            "body": {
              "mode": "raw",
              "raw": "{\n  \"nickname\": \"Grovy\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            }
          }
        },
        {
          "name": "Update - empty body (400)",
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test(\"Status code is 400\", function () { pm.response.to.have.status(400); });"
                ]
              }
            }
          ],
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/pokemon/{{pokemonId}}",
              "host": [
                "{{baseUrl}}"
              ],
              "path": [
                "pokemon",
                "{{pokemonId}}"
              ]
            },
            "body": {
              "mode": "raw",
              "raw": "{}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            }
          }
        },
        {
          "name": "Update - invalid level (400)",
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test(\"Status code is 400\", function () { pm.response.to.have.status(400); });"
                ]
              }
            }
          ],
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/pokemon/{{pokemonId}}",
              "host": [
                "{{baseUrl}}"
              ],
              "path": [
                "pokemon",
                "{{pokemonId}}"
              ]
            },
            "body": {
              "mode": "raw",
              "raw": "{\n  \"level\": 0\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            }
          }
        },
        {
          "name": "Update - not found (404)",
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test(\"Status code is 404\", function () { pm.response.to.have.status(404); });"
                ]
              }
            }
          ],
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/pokemon/64b0c0c0c0c0c0c0c0c0c0c0",
              "host": [
                "{{baseUrl}}"
              ],
              "path": [
                "pokemon",
                "64b0c0c0c0c0c0c0c0c0c0c0"
              ]
            },
            "body": {
              "mode": "raw",
              "raw": "{\n  \"level\": 20\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            }
          }
        },
        {
          "name": "Evolve Treecko to Grovyle",
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test(\"Status code is 200\", function () { pm.response.to.have.status(200); });",
                  "pm.test(\"Evolved to Grovyle\", function () { pm.expect(pm.response.json().data.speciesName).to.eql(\"Grovyle\"); });"
                ]
              }
            }
          ],
          "request": {
            "method": "PATCH",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/pokemon/{{pokemonId}}/evolve",
              "host": [
                "{{baseUrl}}"
              ],
              "path": [
                "pokemon",
                "{{pokemonId}}",
                "evolve"
              ]
            }
          }
        },
        {
          "name": "Evolve again - level not enough (400)",
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test(\"Status code is 400\", function () { pm.response.to.have.status(400); });"
                ]
              }
            }
          ],
          "request": {
            "method": "PATCH",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/pokemon/{{pokemonId}}/evolve",
              "host": [
                "{{baseUrl}}"
              ],
              "path": [
                "pokemon",
                "{{pokemonId}}",
                "evolve"
              ]
            }
          }
        }
      ]
    },
    {
      "name": "04 - Delete",
      "item": [
        {
          "name": "Delete Pokemon",
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test(\"Status code is 200\", function () { pm.response.to.have.status(200); });"
                ]
              }
            }
          ],
          "request": {
            "method": "DELETE",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/pokemon/{{pokemonId}}",
              "host": [
                "{{baseUrl}}"
              ],
              "path": [
                "pokemon",
                "{{pokemonId}}"
              ]
            }
          }
        },
        {
          "name": "Delete again - not found (404)",
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test(\"Status code is 404\", function () { pm.response.to.have.status(404); });"
                ]
              }
            }
          ],
          "request": {
            "method": "DELETE",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/pokemon/{{pokemonId}}",
              "host": [
                "{{baseUrl}}"
              ],
              "path": [
                "pokemon",
                "{{pokemonId}}"
              ]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000"
    },
    {
      "key": "pokemonId",
      "value": ""
    }
  ]
}