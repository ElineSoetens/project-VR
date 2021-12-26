function satellite_rot(model,rot_ang,rot_axis,origin,
			           translation,scaling){

				//Create quaternion 
				let rot_quat = glMatrix.quat.create(); 
				glMatrix.quat.setAxisAngle(rot_quat, rot_axis, rot_ang); 
				 
				//Create rotation matrix from quaternion 
				let rot = glMatrix.mat4.create(); 
				glMatrix.mat4.fromRotationTranslationScaleOrigin 
				(rot, rot_quat,translation, scaling, origin) ; 
				 
				//Apply rotation 
				glMatrix.mat4.multiply(model,rot,model); 
				
				
				/*//invert rotation matrix  
				var rot_inv = glMatrix.mat4.create(); 
				glMatrix.mat4.invert(rot_inv,rot); 
				//Can be nice effect around origin = (0,0,0) but else uncontrollable
				//glMatrix.mat4.multiply(pl_mesh.model,glMatrix.mat4.multiply(pl_mesh.model,rot,pl_mesh.model),rot_inv);
				
				*/
				/*
				// // Rodrigues hardcode around 0,1,0 //
				
				//Create quaternion
				var theta = 0.05;//deltaTime/5.0 %(2.0*Math.PI);
				var s = Math.cos(theta/2.0);
				var x = Math.sin(theta/2.0)*0.0; //
				var y = Math.sin(theta/2.0)*1.0;
				var z = Math.sin(theta/2.0)*0.0;
				
				//Create rotation matrix from quaternion
				var rot = glMatrix.mat4.fromValues
				(1.0-2.0*y*y-2.0*z*z, 2.0*x*y-2.0*s*z,2.0*x*z+2.0*s*y, 0.0,
				2.0*x*y+2.0*s*z,1.0-2.0*x*x-2.0*z*z, 2.0*y*z-2.0*s*x,0.0,
				2.0*x*z-2.0*s*y, 2.0*y*z+2.0*s*x, 1.0-2.0*x*x-2.0*y*y,0.0,
				0.0,0.0,0.0,1.0);
				
				//Invert it
				var rot_inv = glMatrix.mat4.create();
				glMatrix.mat4.invert(rot_inv,rot);
				
				//Rotate
				//glMatrix.mat4.multiply(pl_mesh.model,glMatrix.mat4.multiply(pl_mesh.model,rot,pl_mesh.model),rot_inv);
				//glMatrix.mat4.multiply(pl_mesh.model,rot,pl_mesh.model);
				
				*/
}

function activateParticle(gl,shader, buffer){

	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    const sizeofFloat = Float32Array.BYTES_PER_ELEMENT;
    const att_ver = gl.getAttribLocation(shader.program, 'vertex');
    gl.enableVertexAttribArray(att_ver);
    gl.vertexAttribPointer(att_ver, 3, gl.FLOAT, false, 3 * sizeofFloat, 0 * sizeofFloat); 

}

class Particle {
	//Note position and velocity should be glMatrix.vec3
	//color should be a glMatrix.vec4
	//life is a float
	constructor(position, velocity, orientation, color, life){
		this.position = position;
		this.velocity = velocity;
		this.orientation = orientation;
		this.color = color;
		this.life = life;
		this.size = 0.001;
		this.category = Math.floor(Math.random()*1.5);
	}

	update_part(part_added, new_part){
		this.life = this.life - 0.005;
        if(this.life > 0.0){
            this.position = glMatrix.vec3.scaleAndAdd(this.position,this.position,this.velocity,0.005);
			//plus rouge et extérieur
			if (this.category == 0){
				this.color[1] = this.color[1] - 0.005 * 2.0
            	this.color[2] = this.color[2] - 0.005 * 3.0
			} 
			//plus jaune et intérieur
			else {
				this.color[1] = this.color[1] - 0.005 * 0.5
            	this.color[2] = this.color[2] - 0.005 * 2.0
			}
            
			//this.color[3] = this.color[3] - 0.005 * 2.0
            this.size = Math.min(this.life/900, 0.001) 
			return false;
        }
        else{
          if(part_added <= new_part){
            //this.velocity = glMatrix.vec3.random(this.velocity,0.05);
			if(this.category == 0){
				this.life = Math.random()*2.0;
				this.position = glMatrix.vec3.random(this.position,0.08);
				this.velocity = glMatrix.vec3.fromValues(Math.random()*0.6 - 0.3,0.4,Math.random()*0.6 - 0.3);
				this.color = glMatrix.vec4.fromValues(1.0,0.6,0.4,1.0);
			}else{
				this.life = Math.random()*0.8;
				this.position = glMatrix.vec3.random(this.position,0.03);
				this.velocity = glMatrix.vec3.fromValues(Math.random()*0.4 - 0.2,0.5,Math.random()*0.4 - 0.2);
				this.color = glMatrix.vec4.fromValues(1.0,1.0,1.0,1.0);
			}		
            this.orientation = glMatrix.vec3.random(this.orientation,1.0);
            
            this.size = 0.001
            return true;
          }
                    
        }
	}
}