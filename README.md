# naematel.com rentbot

Scraping rental ad from several sources with scrapy and serve them over React app

# Install for local dev

macOS:

    brew install berkeley-db
    YES_I_HAVE_THE_RIGHT_TO_USE_THIS_BERKELEY_DB_VERSION=1 BERKELEYDB_DIR='/usr/local/' pip install bsddb3
    pip install -r requirements.txt

Ubuntu:

    apt install libdb-dev

# Install on a server

    cd ansible
    ansible-playbook -i hosts install_es.yml
    ansible-playbook -i hosts install_web.yml

# Generate certiicates on the server :

```
certbot certonly --webroot -m zarrro@gmail.com --webroot-path=/srv/.well-known/ -d naematel.com -d kibana.naematel.com
```
