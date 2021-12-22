var load_obj = async function(name = 'bunny_small.obj') {
    async function load_mesh(string) {
      var lines = string.split("\n");
      var positions = [];
      var normals = [];
      var textures = [];
      var vertices = [];
     
      for ( var i = 0 ; i < lines.length ; i++ ) {
        var parts = lines[i].trimRight().split(' ');
        if ( parts.length > 0 ) {
          switch(parts[0]) {
            case 'v':  positions.push(
              glMatrix.vec3.fromValues(
                parseFloat(parts[1]),
                parseFloat(parts[2]),
                parseFloat(parts[3])
              ));
              break;
            case 'vn':
              normals.push(
                glMatrix.vec3.fromValues(
                  parseFloat(parts[1]),
                  parseFloat(parts[2]),
                  parseFloat(parts[3])
              ));
              break;
            case 'vt':
              textures.push(
                glMatrix.vec2.fromValues(
                  parseFloat(parts[1]),
                  parseFloat(parts[2])
              ));
              break;
            case 'f': {
              // f = vertex/texture/normal vertex/texture/normal vertex/texture/normal
              var f1 = parts[1].split('/');
              var f2 = parts[2].split('/');
              var f3 = parts[3].split('/');

              //Need to compute tangente and bitangent 
              //computation comes from learn open gl : 
              pos1 = positions[parseInt(f1[0]) - 1];
              pos2 = positions[parseInt(f2[0]) - 1];
              pos3 = positions[parseInt(f3[0]) - 1];

              uv1 = textures[parseInt(f1[1]) - 1];
              uv2 = textures[parseInt(f2[1]) - 1];
              uv3 = textures[parseInt(f3[1]) - 1];

              edge1 = glMatrix.vec3.create();
              edge2 = glMatrix.vec3.create();
              deltaUV1 = glMatrix.vec2.create();
              deltaUV2 = glMatrix.vec2.create();
              edge1 = glMatrix.vec3.sub(edge1, pos2, pos1);
              edge2 = glMatrix.vec3.sub(edge2, pos3, pos1);
              deltaUV1 = glMatrix.vec2.sub(deltaUV1, uv2, uv1);
              deltaUV2 = glMatrix.vec2.sub(deltaUV2, uv3, uv1);

              f = 1.0 / (deltaUV1[0] * deltaUV2[1] - deltaUV2[0] * deltaUV1[1]);

              

              tangent_x = f * (deltaUV2[1] * edge1[0] - deltaUV1[1] * edge2[0]);
              tangent_y = f * (deltaUV2[1] * edge1[1] - deltaUV1[1] * edge2[1]);
              tangent_z = f * (deltaUV2[1] * edge1[2] - deltaUV1[1] * edge2[2]);

              bitangent_x = f * (-deltaUV2[0] * edge1[0] + deltaUV1[0] * edge2[0]);
              bitangent_y = f * (-deltaUV2[0] * edge1[1] + deltaUV1[0] * edge2[1]);
              bitangent_z = f * (-deltaUV2[0] * edge1[2] + deltaUV1[0] * edge2[2]);

              tangent = glMatrix.vec3.fromValues(tangent_x,tangent_y,tangent_z);
              bitangent = glMatrix.vec3.fromValues(bitangent_x,bitangent_y,bitangent_z);
              //console.log(tangent)
              // Push vertex 1 of the face
              Array.prototype.push.apply(
                vertices, positions[parseInt(f1[0]) - 1]
              );
              Array.prototype.push.apply(
                vertices, textures[parseInt(f1[1]) - 1]
              );
              Array.prototype.push.apply(
                vertices, normals[parseInt(f1[2]) - 1]
              );
              Array.prototype.push.apply(
                vertices,tangent
              );
              Array.prototype.push.apply(
                vertices, bitangent
              );
              // Push vertex 2 of the face
              Array.prototype.push.apply(
                vertices, positions[parseInt(f2[0]) - 1]
              );
              Array.prototype.push.apply(
                vertices, textures[parseInt(f2[1]) - 1]
              );
              Array.prototype.push.apply(
                vertices, normals[parseInt(f2[2]) - 1]
              );
              Array.prototype.push.apply(
                vertices,tangent
              );
              Array.prototype.push.apply(
                vertices, bitangent
              );
              // Push vertex 3 of the face
              Array.prototype.push.apply(
                vertices, positions[parseInt(f3[0]) - 1]
              );
              Array.prototype.push.apply(
                vertices, textures[parseInt(f3[1]) - 1]
              );
              Array.prototype.push.apply(
                vertices, normals[parseInt(f3[2]) - 1]
              );
              Array.prototype.push.apply(
                vertices,tangent
              );
              Array.prototype.push.apply(
                vertices, bitangent
              );
              break;
            }
          }
        }
      }
      var vertexCount = vertices.length / 14; //8
      console.log("Loaded mesh with " + vertexCount + " vertices");
      return {
        buffer: new Float32Array(vertices),
        num_triangles: vertexCount
      };
    }
    
    const response = await fetch(name);
    const text = await response.text();
    
    const ret = await load_mesh(text);

    return ret;
}
    

var make_object = async function(gl, obj) {
    // We need the object to be ready to proceed:
    obj = await obj;
    
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, obj.buffer, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    var Model = glMatrix.mat4.create();
    Model = glMatrix.mat4.translate(Model, Model, glMatrix.vec3.fromValues(0.5, -0.5, -1.0));

    function activate(shader) {
        // these object have all 3 positions + 2 textures + 3 normals
        //now : these object have all 3 positions + 2 texture + 3 normals + 3 tangent + 3 bitangent
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        const sizeofFloat = Float32Array.BYTES_PER_ELEMENT;
        const att_pos = gl.getAttribLocation(shader.program, 'position');
        gl.enableVertexAttribArray(att_pos);
        gl.vertexAttribPointer(att_pos, 3, gl.FLOAT, false, 14 * sizeofFloat, 0 * sizeofFloat); //8 at 14

        const att_textcoord = gl.getAttribLocation(shader.program, "texcoord");
        gl.enableVertexAttribArray(att_textcoord);
        gl.vertexAttribPointer(att_textcoord, 2, gl.FLOAT, false, 14 * sizeofFloat, 3 * sizeofFloat); //8 at 14
    
        const att_nor = gl.getAttribLocation(shader.program, 'normal');
        gl.enableVertexAttribArray(att_nor);
        gl.vertexAttribPointer(att_nor, 3, gl.FLOAT, false, 14 * sizeofFloat, 5 * sizeofFloat); //8 at 14

        const att_tan = gl.getAttribLocation(shader.program, 'tangent');
        gl.enableVertexAttribArray(att_tan);
        gl.vertexAttribPointer(att_tan, 3, gl.FLOAT, false, 14 * sizeofFloat, 8 * sizeofFloat);

        const att_bitan = gl.getAttribLocation(shader.program, 'bitangent');
        gl.enableVertexAttribArray(att_bitan);
        gl.vertexAttribPointer(att_bitan, 3, gl.FLOAT, false, 14 * sizeofFloat, 11 * sizeofFloat);
        
    }

    function draw() {
        gl.drawArrays(gl.TRIANGLES, 0, obj.num_triangles);
    }

    return {
        buffer: buffer,
        model: Model,
        activate: activate,
        draw: draw,
    }

}