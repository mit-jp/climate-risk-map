FROM ubuntu:latest
LABEL Name=climateriskmap Version=0.0.1
RUN apt-get -y update && apt-get install -y fortunes
CMD ["sh", "-c", "echo hello"]
