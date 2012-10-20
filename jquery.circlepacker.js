(function( $ ){

  $.fn.circlePacker = function(circles,options) {  

     // Create some defaults, extending them with any options that were provided
    var settings = $.extend( {
      'damping' : 0.1,
      'dampingAccel' : 0.95,
      'dampingCutoff' : 0.010,
    }, options);
   

    return this.each(function() { 

    	//reference to (this) holder of circles
    	var container = $(this);

    	//center of container
    	var centerX = container.width()/2;
    	var centerY = container.height()/2;

    	//array for holding circles
    	var circAR = new Array();


    	//for jquery loop
    	var i = 0;
    	circles.each(function() {
    		if(i%2 == 0)
    		{
	    		var l = Math.floor(Math.random() * container.width()+container.width());	
    		} else
    		{
	    		var l = Math.floor(Math.random() * container.width()/2);
    		}
    		var t = Math.floor(Math.random() * container.height());
    		$(this).css({
    			'left':l,
    			'top':t
    		})
    		$(this).data('xPos',l);
    		$(this).data('yPos',t);
    		var r = $(this).width()/2+3;
    		$(this).data('radius',r);
    		circAR.push($(this));
    		i++;
    	})

    	//reassign array for circles
    	circles = circAR;

    	circles = circles.sort(sortFromCenter);
    	var packCircles = function() {

	    	//iterated circle local insance
	    	var ci;
	    	var cj;
	    	//vector object
	    	var v;
	    	var dx;
	    	var dy;
	    	var r;
	    	var d;


	      //push away from each other
	      for(var i=0;i<circles.length;i++)
	      {
	      	ci = circles[i];
	      	//compare each to other
	      	for(var j=0;j<circles.length;j++)
	      	{
	      		cj = circles[j];
	      		
	      		if(i == j)
	      		{
	      			continue;
	      		}

			    	//vector object
			    	v = {};
	      		dx = cj.data('xPos')-ci.data('xPos');
	      		dy = cj.data('yPos')-ci.data('yPos');
	      		r = ci.data('radius') + cj.data('radius');
	      		d = (dx*dx) + (dy*dy);

	      		if(d < ((r*r)-0.01))
	      		{
	      			v.x = dx;
	      			v.y = dy;
	      			//normalize vector
	      			var length = Math.sqrt(d);
	      			v.x = v.x/length;
	      			v.y = v.y/length;
	      			//scale vector
	      			var scale = (r - length)*.5;
	      			v.x*=scale;
	      			v.y*=scale;

	      			var l = ci.data('xPos') - v.x;
	      			var t = ci.data('yPos') - v.y;
	      			ci.css({'top':t,'left':l});
	      			ci.data('xPos',l);
	      			ci.data('yPos',t);

	      			var l = cj.data('xPos') + v.x;
	      			var t = cj.data('yPos') + v.y;
	      			cj.css({'top':t,'left':l}); 
	      			cj.data('xPos',l);
	      			cj.data('yPos',t);     			

	      		}
	      	}

	      }

	      //deceleration for number of tries
	      settings.damping*=settings.dampingAccel;

	      //push toward center
	      for(var i=0;i<circles.length;i++)
	      {
	      	var c = circles[i];
	      	var x = (c.data('xPos') - centerX)*settings.damping;
	      	var y = (c.data('yPos') - centerY)*settings.damping;

	      	var l = Math.max(c.data('xPos')-x,c.data('radius'));
	      	var t = Math.max(c.data('yPos')-y,c.data('radius'));
	  			c.css({'top':t,'left':l});
    			c.data('xPos',l);
    			c.data('yPos',t); 
	      }

	      if(settings.damping < settings.dampingCutoff)
	      {
	      	container.delay(300).fadeTo(300,1);
	      } else
	      {
	      	setTimeout(packCircles,10)
	      }

    	}
    	setTimeout(packCircles,10);



	  	function sortFromCenter(a,b)
	  	{
	  		var dax = a.position().left - centerX;
	  		var day = a.position().top - centerY;
	  		var dbx = b.position().left - centerX;
	  		var dby = b.position().top - centerY;
	  		var da = dax*dax + day*day;
	  		var db = dbx*dbx + dby*dby;
	  		return db-da;
	  	}

    });

  };
})( jQuery );
