This certificate and private key are for testing the https functions in node and are not intended for production use
because the private key is not private since it is checked into a source code repository.

Instructions from but modified to use 2048 length key to avoid FireFox 33 error:
https://docs.nodejitsu.com/articles/HTTP/servers/how-to-create-a-HTTPS-server

openssl genrsa -out key.pem 2048
openssl req -new -key key.pem -out csr.pem
openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
rm csr.pem

# Renaming the files:
mv cert.pem pointrel-test-cert.pem
mv key.pem pointrel-test-key.pem

