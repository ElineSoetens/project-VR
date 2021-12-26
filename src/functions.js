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

function moveObjectKey(doc,model,y){
	doc.addEventListener('keydown', (event) => {
		  const key = event.key;
		  
		//<li>1. Add the functions to use the arrows and +/- to move in 3 directions</li>
		// 1. Your Code
		//Up Down Right Left
		  if (key === '0') {
		    // 1. Your code
			//translation up to lower the view
			glMatrix.mat4.translate(model, model, glMatrix.vec3.fromValues(0.0, y, 0.0));

			return;
		  }
		   else if (key === '1') {
		   //translate low to shift up the view
		    glMatrix.mat4.translate(model, model, glMatrix.vec3.fromValues(0.0, -y, 0.0));
			return;
		  
		}
},false);
}


function checkCollisions(colliders_list,r_collider, other, r_other){
	//contains all objects in collision
	var in_collision = [];
	
	//for each pair of objects in colliders_list check if they collide
	for(let j = 0; j < colliders_list.length; j++){
	//position = last column 
	//  /!\ here matrix 4x4 = vetor 1x16
	let pos_j = glMatrix.vec3.fromValues(colliders_list[j][12],
										 colliders_list[j][13],
										 colliders_list[j][14]);
	glMatrix.vec3.negate(pos_j,pos_j);
	
	for (let i = 0; i < colliders_list.length; i++){
		if(colliders_list[i] != colliders_list[j]){
		//position = last column 
		//  /!\ here matrix 4x4 = vetor 1x16
		let pos_i = glMatrix.vec3.fromValues(colliders_list[i][12],
											 colliders_list[i][13],
											 colliders_list[i][14]);
													
		//Create a vector with norm > 	r_collider+ r_other																	
		let sub =glMatrix.vec3.fromValues(2*(r_collider+ r_other),1.0,0.0);
		// sub = distance vector between objects
		glMatrix.vec3.add( sub, pos_i,pos_j);
		
		// object other has a different radius must be taken into account 
		// => 2 cases
		if(colliders_list[j]== other || colliders_list[i]==other){
			if (glMatrix.vec3.len(sub) < r_collider + r_other){
				in_collision.push(colliders_list[j],colliders_list[i]);	

		}}
		else{
			if (glMatrix.vec3.len(sub) < 2.0*r_collider ){
				in_collision.push(colliders_list[j],colliders_list[i]);
		}	
	
	}
	}
	}
}

	
	return in_collision;
}
