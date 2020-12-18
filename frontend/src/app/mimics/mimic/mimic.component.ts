import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { ActivatedRoute, Router } from "@angular/router";
import * as $ from 'jquery';
import 'jquery-ui-dist/jquery-ui';

@Component({
  selector: 'app-mimic',
  templateUrl: './mimic.component.html',
  styleUrls: []

})
export class MimicComponent implements OnInit {

  mimicId: any;

  constructor(public apiService: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => {
      this.mimicId = params.id;
      console.log("..this.mimicId..", this.mimicId);
    });
  }

  ngOnInit() {
    var $this = this;
    $(".mozgat").draggable({
      helper: "clone",
      appendTo: "body",
      revert: "invalid",
      snap: ".tapad",
      stack: ".mozgat",
      scroll: false
    });

    $("#ch_dndBoard1").droppable({
      cursor: "move",
      accept: ".mozgat",
      activeClass: "snaptarget-hover",
      drop: function (event, ui) {
        var ct = $(this);
        var item = $(ui.draggable);
        var origPos;
        var ctPos = ct.offset();
  console.log("item.....", item);
        if (item.is('.tapad')) {
          origPos = item.offset();
          ct.append(item);
        } else {
          origPos = ui.offset;
          item = item.clone();
          ct.append(item);
          item.removeClass("ui-draggable");
          item.addClass('tapad');
          item.draggable({
            containment: "#ch_dndBoard1",
            snap: ".tapad",
            stack: ".mozgat",
            scroll: false
          });
          item.on('dragend', function () {
            alert(item.getPosition().x + "/" + item.getPosition().y);
          });
          $(item.find('img')).resizable();
          item.addClass('remove');
          var ex = $('<i class="fa fa-times-circle delete btn-danger" aria-hidden="true"></i>').css({
            'position': 'absolute',
            'top': -20,
            'right': 0,
            'padding': '1px',
            'font-size': '10px'
          });
          $(ex).insertBefore($(item.find('p')));
          item.appendTo('#droppable');
          $('.delete').on('click', function () {
            $(this).closest('.mozgat').remove();
          });
        }
        item.css({
          top: origPos.top - ctPos.top,
          left: origPos.left - ctPos.left 
        });
      }
    });
    $('#snaptarget3').droppable({
      over: function (event, ui) {
        ui.draggable.remove();
      }
    });
  }

  applyRotation() {
    $('.handler').draggable({
      opacity: 0.01,
      helper: 'clone',
      drag: function (event, ui) {
        console.log("ui.position",ui.position);
        var rotateCSS = 'rotate(' + ui.position.left + 'deg)';
        console.log("ui",ui);
        $(this).parent().css({
          '-moz-transform': rotateCSS,
          '-webkit-transform': rotateCSS
        });
        // $(this).parent().css({
        //   top: ui.position.top,
        //   left: ui.position.left 
        // });
      }
    });
  }
}
