# Node Website Crawler

This project aims at recursively crawling of a selected website by harvesting all possible hyperlinks and stores them in database.

## Prerequisites
1. Docker installation
2. docker-compose installation
3. reliable internet connection to fetch the docker image

## Steps for execution of project

```bash
git clone 'repo'
cd 'dir_created_from_repo'
docker-compose up
```

##ToDo (coming soon in one day):
1. Mongodb connectivity
2. Schema generation for saving the results

## Note
```
Haven't used persistent storage for database which means if container gets destroyed, data will be lost

To overcome that, disk can be mounted by giving volume in mongo section of docker-compose.yml
```