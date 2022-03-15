process.on('message', function(data) {
    process.send({ site: data.site });
});