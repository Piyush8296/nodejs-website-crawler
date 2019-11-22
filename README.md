# Node Website Crawler

This project aims at recursively crawling of a selected website by harvesting all possible hyperlinks and stores them in database.

## Prerequisites
1. Docker installation
2. docker-compose installation
3. reliable internet connection to fetch the docker image

## Steps for execution of project

```bash
git clone 'REPO'
cd 'PROJECT_DIR'
docker-compose up
```

## Note
```
Haven't used persistent storage for database which means if container gets destroyed, data will be lost

To overcome that, disk can be mounted by giving volume in mongo section of docker-compose.yml
```

#To fetch and save URLs in DB

##Request

GET http://<SERVER_ADDRESS>:4000/api/crawl_weblink

```
curl -i -H 'Accept: application/json' http://localhost:4000/api/crawl_weblink
```

###Fetch saved records from db
GET http://<SERVER_ADDRESS>:4000/api/fetch_saved_links

```
curl -i -H 'Accept: application/json' http://localhost:4000/api/fetch_saved_links
```