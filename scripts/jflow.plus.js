/* Copyright (c) 2010 WordImpressed.com jFlow Plus by Devin Walker

 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)

 * jFlow 2.0 (Plus)

 * Version: jFlow Plus

 * Requires: jQuery 1.2+

 */
(function ($) {
    $.fn.jFlow = function (options) {
        var opts = $.extend({}, $.fn.jFlow.defaults, options);
        var randNum = Math.floor(Math.random() * 11);
        var jFC = opts.controller;
        var jFS = opts.slideWrapper;
        var jSel = opts.selectedWrapper;
        var cur = 0;
        var timer;
        var maxi = $(jFC).length;
        //get width of individual slides
        var width = $(opts.slides).children().outerWidth();
		//get current number of slides
		var slidesNum = $(opts.slides).children().size();
		//get the total width
		var totalWidth = width * slidesNum;
		//last slide number
		var lastSlide = (slidesNum - 1);
		// additional container length for 'flow'
        var additionalSlide = slidesNum + 1;
		//defualt pause time between transitions
		var pause = opts.pause;
		// jFlow sliding function which handles the animations
		// current animations: 'rewind' and 'flow'
        var slide = function (dur, i) {
                //hide overflow for slides
                $(opts.slides).children().css({
                    overflow: "hidden"
                });
                //handling iframes
                $(opts.slides + " iframe").hide().addClass("temp_hide");
                //depending of our effect we will do different animations			
                if (opts.effect == "rewind") {
                    //this is our 'rewind' animation where the slide will rewind to first slide in stack
                    $(opts.slides).animate({
                        marginLeft: "-" + (i * $(opts.slides).find(":first-child").width() + "px")
                    }, opts.duration * (dur), opts.easing, function () {
                        $(opts.slides).children().css({
                            overflow: "hidden"
                        });
                        $(".temp_hide").show();
                    });
                }
                // now we need to address the flow effect
                // this is a bit different way of handling the slides
                else if (opts.effect == "flow") {
                    //number of slides
                 
                    //if we are NOT on the last slide
                    if (i != 0) {
                        $("#mySlides").animate({
                            left: -(i * width)
                        }, function () {
                            //if we are on the last slide then move the first slide into position
                            if ((slidesNum - 1) == i) {
                                $(".jFlowSlideContainer").first().css({
                                    //left slide distance is equal to width of slide times number of slides
                                    left: (width * slidesNum)
                                });
                            }
                        });
						
						//fire off the paging function 
						movePagingClass();
						
                    }
                    // we are DONE with the normal slide login
					// now if we are on the last slide then
                    // this is the logic to move the first slide into position
					// along with increasing the slide container width
                    else {
					
                        //animate the first slide container into position
                        $(".jFlowSlideContainer").first().animate({
                            //left slide distance is equal to width of slide times number of slides		
                            left: (width * slidesNum)
                       });
                   
                        //set the container width to be large enough
                        $(opts.slides).css({
                            // width is equal to the outer width of the container plus width one slide
                            width: (width * additionalSlide)
                         
                        });
                        //animate the slide container to the left 
                        //to create the flow effect
                        $(opts.slides).animate({
                            left: "-"+totalWidth 
                        },
                        //important: we need to reestablish our first slide and container
                        // after the animation is complete
						function () {
                            //position the slide container element back to start
                            $(this).css('left', '0px');
                            //position the first slide back to start
                            $(".jFlowSlideContainer").first().css('left', '0px');
                      
					  
					    });
						
						
						//move the selected class from the last li to the first
						$('.jFlowSelected').removeClass('jFlowSelected');
						$(jFC).first().addClass('jFlowSelected');
						
                    }
                  
					
                }
				
							
             
            }
			
		//pagination class
		var movePagingClass = function() {
				//advance the 'selected' pagination class 
				var thisController = $('.jFlowSelected');
				$(thisController).removeClass('jFlowSelected');
				$(thisController).next().addClass('jFlowSelected');		
		}
		

		//slide animation for pagination
		//also add the jFlowSelected class to the appropriate controller
        $(this).find(jFC).each(function (i) {
			
			//when the first paging item is clicked 
			//handle the animation a bit differently
			//than the other slides
			$(jFC).first().click(function() {
			
				//ensure the first slide is in position
				$('.jFlowSlideContainer').first().css({
					
					left: '0px'
					
				});
				//animate the slide container into position
				$('#mySlides').animate({
					left: '0px'
				});
				
				
				//move the selected pagination class to the first item
				 $(jFC).removeClass(jSel);
                 $(this).addClass(jSel);
				
				
			});
			
			//controller slide function for the remaining slides
            $(this).click(function () {
				
				//start up the timer
                dotimer();
				
				//if this slide is not animated
                if ($(opts.slides).is(":not(:animated)")) {
					//slide to the page clicked
                    var dur = Math.abs(cur - i);
                    slide(dur, i);
                    cur = i;
					
					
					//move the selected pagination class to the clicked item
                    $(jFC).removeClass(jSel);
                    $(this).addClass(jSel);
					
				
                } 
				
				
				
            });
        });		
		
		
	
		
		
        //Initiate our jFlow Plus slide
        $(opts.slides).before('<div id="' + jFS.substring(1, jFS.length) + '"></div>').appendTo(jFS);
        //find each of our slide elements and wrap them
        $(opts.slides).find(".slide").each(function () {
            $(this).before('<div class="jFlowSlideContainer"></div>').appendTo($(this).prev());
        });
        //initialize the controller
        $(jFC).eq(cur).addClass(jSel);
        var resize = function (x) {
                $(jFS).css({
                    position: "relative",
                    width: opts.width,
                    height: opts.height,
                    overflow: "hidden"
                });
                //opts.slides or #mySlides container
                $(opts.slides).css({
                    position: "relative",
                    width: $(jFS).width() * $(jFC).length + "px",
                    height: $(jFS).height() + "px",
                    overflow: "hidden"
                });
                // jFlowSlideContainer
                $(opts.slides).children().css({
                    position: "relative",
                    width: $(jFS).width() + "px",
                    height: $(jFS).height() + "px",
                    "float": "left",
                    overflow: "hidden"
                });
                $(opts.slides).css({
                    marginLeft: "-" + (cur * $(opts.slides).find(":eq(0)").width() + "px")
                });
            }
            // sets initial size
            resize();
        // resets size
        $(window).resize(function () {
            resize();
        });
        $(opts.prev).click(function () {
            dotimer();
            doprev();
        });
        $(opts.next).click(function () {
            dotimer();
            donext();
        });
		
  		//The Previous btn function
        var doprev = function (x) {
			
                //using the normal rewind effect
                if (opts.effect == 'rewind') {
                    if ($(opts.slides).is(":not(:animated)")) {
                        var dur = 1;
                        if (cur > 0) {
                            cur--;
                        } else {
                            cur = maxi - 1;
                            dur = cur;
                        }
                        $(jFC).removeClass(jSel);
                        slide(dur, cur);
                        $(jFC).eq(cur).addClass(jSel);
                    }
                }
                // we're using the 'flow' effect so we'll need a slightly different 
                // method of navigating out slides using the previous button
                else if (opts.effect == 'flow') {

					// Increase the Slide Container Width:
					// if we are on the last slide and click next btn
					// ensure that our first slide is in position
					if(cur == 0) { 
					
						
					  $(opts.slides).css({
                            // width is equal to the outer width of the container plus width one slide
                            width: (width * additionalSlide)
                        });
										
                        $('.jFlowSlideContainer:last').css({
                            position: "absolute",
                            left: "-"+width+"px"
                        });
                        //add padding to display the last slide
                        //NEED TO MAKE DYMANIC
                        $('#mySlides').animate({
                            paddingLeft: width+"px"
                        });
                        //animate the last slide
                        $('.jFlowSlideContainer:last').animate({
                            left: "0px"
                        }, function () {
                            //change the position of this last slide
                            //to shift to default placement
                            $(this).css({
                                position: "relative",
                                left: ""
                            });
                            //move the slide container position to the last slide
                            //NEED TO MAKE DYMANIC
                            $('#mySlides').css({
                                padding: "0px",
                                left: "-"+(totalWidth - width)+"px"
                            });
						
                        });
                        
						//change current slide variable to the last slide number
                         cur = slidesNum - 1;
						 
						//move the selected class from the last li to the first
						$('.jFlowSelected').removeClass('jFlowSelected');
						$(jFC).last().addClass('jFlowSelected');
						 
                    } //else slide as normal
                    else {
						//if our last slide is out of position
						//move it to the proper position
						if($(opts.slides).find(":first-child").css({ left: totalWidth })) {
							$(opts.slides).find(":first-child").css('left','0px');
						}

                        $('#mySlides').animate({
                            left: -(width * (cur - 1))
                        }, {
                            queue: false
                        });
                        cur = cur - 1;
						
                    	//advance the 'selected' pagination class 
						var thisController = $('.jFlowSelected');
						$(thisController).removeClass('jFlowSelected');
						$(thisController).prev().addClass('jFlowSelected');	
						
						
					}
                    //no effect entered so throw alert		
                } else {
                    alert('Error: No effect entered as option!');
                }
            }
			
		// the next button function
        var donext = function (x) {
			
				if(cur == lastSlide) {
					$(".jFlowSlideContainer").first().css({
						"left": totalWidth+"px"
						});
				}
			
                if (opts.effect == 'rewind') {
                    if ($(opts.slides).is(":not(:animated)")) {
                        var dur = 1;
                        if (cur < maxi - 1) cur++;
                        else {
                            cur = 0;
                            dur = maxi - 1;
                        }
                        $(jFC).removeClass(jSel);
                        //$(jFS).fadeOut("fast");
                        slide(dur, cur);
                        //$(jFS).fadeIn("fast");
                        $(jFC).eq(cur).addClass(jSel);
                    }
                }
                // we're using the 'flow' effect so we'll need a slightly different 
                // method of navigating out slides using the previous button
                else if (opts.effect == 'flow') {
					//check to see which slide we are on and set "cur" variable
                    if ($(opts.slides).is(":not(:animated)")) {
                        var dur = 1;
                        if (cur < maxi - 1) cur++;
                        else {
                            cur = 0;
                            dur = maxi - 1;
                        }
                    }
                    //fire off the slide function
                    //also pass our parameters					
                    slide(dur, cur);
                } //end: "flow'
            } //end: donext function
			
		//the jFlow Timer
        var dotimer = function (x) {
                if ((opts.auto) == true) {
                    if (timer != null) clearInterval(timer);
                    timer = setInterval(function () {
                        $(opts.next).click();
                    }, pause);
                }
            }
            //Pause/Resume function fires at hover
            dotimer();
        $(opts.slides).hover(

        function () {
            clearInterval(timer);
        }, function () {
            dotimer();
        });
    };
    //end jFlow Plus Functions
    //default jFlow Plus Options
    $.fn.jFlow.defaults = {
        // must be class, use . sign
        controller: ".jFlowControl",
		// must be id, use # sign
        slideWrapper: "#jFlowSlider",
        // the div where all your sliding divs are nested in
        slides: "#mySlides",
        // just pure text, no sign
        selectedWrapper: "jFlowSelected",
        //this is the slide effect (rewind or flow)
        effect: "flow",
        // this is the width for the content-slider
        width: "800px",
        // this is the height for the content-slider
        height: "350px",
        // time in miliseconds to transition one slide
        duration: 400,
		//time to pause between transition
		pause: 5000,
        // next btn: must be class, use . sign
        prev: ".jFlowPrev",
        // prev btn: must be class, use . sign
        next: ".jFlowNext",
		// auto slide option: true or false
        auto: true
    };
})(jQuery);