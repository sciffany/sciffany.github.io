﻿package{	import flash.events.*;	import flash.geom.*;	import flash.display.*;	import flash.events.MouseEvent;	public class tileBitmap extends Sprite{				public var tileCode:int; //6-digit code to identify the tile		public var bmp:Bitmap; //bitmap of the tile		public var ts:int;		public var tileMode: int; //0 - shelf, 1 - dragged, 2 - placed onto the mapmc		public var rootClip: MovieClip; 						public function tileBitmap(rootClip:MovieClip, tileCode:int, bmp:Bitmap, ts:int, tileMode:int):void{			this.tileCode = tileCode;			this.bmp = bmp;			this.addChild(bmp);			if(!tileMode)			{this.addEventListener(MouseEvent.MOUSE_DOWN, cloneTile);}			if(tileMode)			{this.addEventListener(Event.ADDED, startDragging);}			this.ts = ts;			this.rootClip = rootClip;			this.tileMode = tileMode;		}									public function cloneTile(e:MouseEvent)		{			if(!tileMode)						{			//make a copy of the bitmapData in bmp to bmpClone			var rect:Rectangle = new Rectangle(0, 0, ts, ts);			var pt:Point = new Point(0, 0);			var bmpClone:Bitmap = new Bitmap(new BitmapData(ts, ts));			bmpClone.bitmapData.copyPixels(bmp.bitmapData, rect, pt);			bmpClone.width/=2;			bmpClone.height/=2;						var tileBitmap1:tileBitmap = new tileBitmap(rootClip, this.tileCode,bmpClone,ts,1);			tileBitmap1.x = stage.mouseX-ts/4-rootClip.mapSprite.x;			tileBitmap1.y = stage.mouseY-ts/4-rootClip.mapSprite.y;			rootClip.mapSprite.addChild(tileBitmap1);						}		}				public function startDragging(e:Event)		{			this.startDrag();			this.addEventListener(MouseEvent.MOUSE_DOWN, stopDragging);		}				public function stopDragging(e:MouseEvent){			this.stopDrag();			var smallTile:int = ts/2;						var coorX:uint=(uint)((this.x+smallTile/2)/smallTile);			var coorY:uint = (uint)((this.y+smallTile/2)/smallTile);			rootClip.mapArray[coorY][coorX] = this.tileCode;			this.x = coorX*smallTile;			this.y = coorY*smallTile;		}	}	}