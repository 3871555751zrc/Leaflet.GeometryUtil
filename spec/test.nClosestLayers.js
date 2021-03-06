describe('N closest layers among an arry of layers', function() {
  it('It should return null if list is empty', function(done) {
    var ll = L.latLng([0, 0]),
        closests = L.GeometryUtil.nClosestLayers(map, [], ll, 1);
    assert.equal(null, closests);
    done();
  });

  it('It should return null if the input n is zero', function(done) {
    var ll = L.latLng([0, 0]),
        layers = [L.marker([2, 2])],
        closests = L.GeometryUtil.nClosestLayers(map, layers, ll, 0);
    assert.equal(null, closests);
    done();
  });

  it('It should return null if the input n is negative', function(done) {
    var ll = L.latLng([0, 0]),
        layers = [L.marker([2, 2])],
        closests = L.GeometryUtil.nClosestLayers(map, layers, ll, -1);
    assert.equal(null, closests);
    done();
  });

  it('It should return an array of objectcs with layer, latlng and distance', function(done) {
    var ll = L.latLng([0, 0]),
        layers = [L.marker([2, 2])],
        closests = L.GeometryUtil.nClosestLayers(map, layers, ll);
    assert.deepEqual(closests[0],
                     {layer: layers[0], latlng: layers[0].getLatLng(), distance: Math.sqrt(2)});
    done();
  });

  it('It should return an array of objects with size n and ordered with their distance', function(done) {
    var ll = L.latLng([0, 0]),
        layers = [L.marker([3, 3]), L.marker([4, 4]), L.marker([2, 2])],
        n = 2,
        closests = L.GeometryUtil.nClosestLayers(map, layers, ll, n);

    assert.equal(closests.length, n);
    assert.equal(closests[1].distance >= closests[0].distance, true);
    done();
  });

  it('It should return an array of objects with the same size of input array if n is larger than the size of input array.', function(done) {
    var ll = L.latLng([0, 0]),
        layers = [L.marker([3, 3]), L.marker([4, 4]), L.marker([2, 2])],
        n = 5,
        closests = L.GeometryUtil.nClosestLayers(map, layers, ll, n);

    assert.equal(closests.length, layers.length);
    assert.equal(closests[1].distance >= closests[0].distance, true);
    assert.equal(closests[2].distance >= closests[1].distance, true);
    done();
  });

  it('It should return an array of objects with the same size of input array if n is not given.', function(done) {
    var ll = L.latLng([0, 0]),
        layers = [L.marker([3, 3]), L.marker([4, 4]), L.marker([2, 2])],
        closests = L.GeometryUtil.nClosestLayers(map, layers, ll);

    assert.equal(closests.length, layers.length);
    done();
  });

  it('It should return the sub layer closest to the latlng point', function(done) {
    var ll = L.latLng([0,5]),
        campus = {
          "type": "Feature",
          "properties": {
              "popupContent": "This is the Auraria West Campus",
              "style": {
                  weight: 2,
                  color: "#999",
                  opacity: 1,
                  fillColor: "#B0DE5C",
                  fillOpacity: 0.8
              }
          },
          "geometry": {
              "type": "MultiPolygon",
              "coordinates": [
                  [
                      [
                          [0, 0],
                          [0, 10],
                          [-105.00921249389647, 39.74468219277038],
                          [-105.01067161560059, 39.74362625960105],
                          [-105.01195907592773, 39.74290029616054],
                          [-105.00989913940431, 39.74078835902781],
                          [-105.00758171081543, 39.74059036160317],
                          [-105.00346183776855, 39.74059036160317],
                          [-105.00097274780272, 39.74059036160317],
                          [-105.00062942504881, 39.74072235994946],
                          [-105.00020027160645, 39.74191033368865],
                          [-105.00071525573731, 39.74276830198601],
                          [-105.00097274780272, 39.74369225589818],
                          [-105.00097274780272, 39.74461619742136],
                          [-105.00123023986816, 39.74534214278395],
                          [-105.00183105468751, 39.74613407445653],
                          [-105.00432014465332, 39.74732195489861]
                      ],[
                          [-105.00361204147337, 39.74354376414072],
                          [-105.00301122665405, 39.74278480127163],
                          [-105.00221729278564, 39.74316428375108],
                          [-105.00283956527711, 39.74390674342741],
                          [-105.00361204147337, 39.74354376414072]
                      ]
                  ],[
                      [
                          [-105.00942707061768, 39.73989736613708],
                          [-105.00942707061768, 39.73910536278566],
                          [-105.00685214996338, 39.73923736397631],
                          [-105.00384807586671, 39.73910536278566],
                          [-105.00174522399902, 39.73903936209552],
                          [-105.00041484832764, 39.73910536278566],
                          [-105.00041484832764, 39.73979836621592],
                          [-105.00535011291504, 39.73986436617916],
                          [-105.00942707061768, 39.73989736613708]
                      ]
                  ]
              ]
          }
        },
        layers = L.geoJson(campus, {

          pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
              radius: 8,
              fillColor: "#ff7800",
              color: "#000",
              weight: 1,
              opacity: 1,
              fillOpacity: 0.8
            });
          }
        }),
        closests = L.GeometryUtil.nClosestLayers(map, layers.getLayers(), ll, 1);
    // we test instanceof because of differences between Leaflet 0.7.7 & 1.0.0
    // in 0.7.7 geojson are LayerGroup, in 1.0, we have directly instances of L.Polyline & co
    assert.deepEqual(closests[0].layer, layers.getLayers()[0] instanceof L.LayerGroup ? layers.getLayers()[0].getLayers()[0] : layers.getLayers()[0])
    assert.deepEqual(closests[0].distance, 4)
    done();
  })
});
