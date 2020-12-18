import { Injectable } from '@angular/core';
import { ApexOptions } from 'apexcharts';

@Injectable({
  providedIn: 'root'
})
export class PluginsService {

  // @ts-ignore
  public $ = window.$;

  constructor() {}

  public index(): void {
    this.loaderInit();
  }

  public dashboardIndex(): void {
    this.sideBarToggle(this.$);
    this.navBarAction(this.$);
    this.wrapperMenuToggle(this.$);
    this.fullscreen(this.$);
    this.accordionToggle(this.$);
  }

  // Function for toggle page Loader...
  public loaderInit(): void {
    this.$('#load').fadeOut();
    this.$('#loading').delay(1000).fadeOut('slow');
  }

  public checkElement(type, element): boolean {
    let found = false;
    let elements;
    switch (type) {
      case 'class':
        elements = document.getElementsByClassName(element);

        if (elements !== undefined && elements !== null && elements.length > 0) {
          found = true;
        }
        break;

      case 'id':
        elements = document.getElementById(element);

        if (elements !== undefined && elements !== null) {
          found = true;
        }
        break;
    }

    return found;
  }

  public sideBarToggle($): void {
    const elementExist = this.checkElement('class', 'iq-sidebar-menu');

    if (elementExist) {
      $('.iq-sidebar-menu a').on('click', function() {
        const checkElement = $(this).next().children();
        console.log(checkElement)
        $('.iq-sidebar-menu li').removeClass('active');
        $(this).closest('li').addClass('active');
        if ((checkElement.is('ul')) && (checkElement.is(':visible'))) {
          $(this).closest('li').removeClass('active');
          checkElement.slideUp('normal');
        }
        if ((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
          $('.iq-sidebar-menu ul ul:visible').slideUp('normal');
          checkElement.slideDown('normal');
        }
        if ($(this).closest('li').find('ul').children().length === 0) {
          return true;
        } else {
          return false;
        }
      });
    }
  }

  public navBarAction($) {
    $(document).on('click', function(e) {
      const myTargetElement = e.target;
      // tslint:disable-next-line:one-variable-per-declaration
      let selector, mainElement;
      if ($(myTargetElement).hasClass('search-toggle')
        || $(myTargetElement).parent().hasClass('search-toggle')
        || $(myTargetElement).parent().parent().hasClass('search-toggle')) {
        if ($(myTargetElement).hasClass('search-toggle')) {
          selector = $(myTargetElement).parent();
          mainElement = $(myTargetElement);
        } else if ($(myTargetElement).parent().hasClass('search-toggle')) {
          selector = $(myTargetElement).parent().parent();
          mainElement = $(myTargetElement).parent();
        } else if ($(myTargetElement).parent().parent().hasClass('search-toggle')) {
          selector = $(myTargetElement).parent().parent().parent();
          mainElement = $(myTargetElement).parent().parent();
        }
        if (!mainElement.hasClass('active') && $('.navbar-list li').find('.active')) {
          $('.navbar-list li').removeClass('iq-show');
          $('.navbar-list li .search-toggle').removeClass('active');
        }

        selector.toggleClass('iq-show');
        mainElement.toggleClass('active');

        e.preventDefault();
      } else if ($(myTargetElement).is('.search-input')) {} else {
        $('.navbar-list li').removeClass('iq-show');
        $('.navbar-list li .search-toggle').removeClass('active');
      }
    });
  }

  public wrapperMenuToggle($) {
    const elementExist = this.checkElement('class', 'wrapper-menu');
    if (elementExist) {
      const wrapperMenu = document.querySelectorAll('.wrapper-menu');
      const body = document.querySelector('body');
      for (let i = 0; i < wrapperMenu.length; i++) {
        wrapperMenu[i].addEventListener('click', function() {
          wrapperMenu[i].classList.toggle('open');
          body.classList.toggle('sidebar-main');
        });
      }
    }
  }

  public fullscreen($) {
    const elementExist = this.checkElement('class', 'iq-full-screen');
    if (elementExist) {
      $(document).on('click', '.iq-full-screen', function() {
        /*const elem = $(this);
        if (!document.fullscreenElement &&
          !document.mozFullScreenElement &&
          !document.webkitFullscreenElement &&
          !document.msFullscreenElement) {
          if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
          } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
          } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
          } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
          }
        } else {
          if (document.cancelFullScreen) {
            document.cancelFullScreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
        }
        elem.find('i').toggleClass('ri-fullscreen-line').toggleClass('ri-fullscreen-exit-line');*/
      });
    }
  }


  public apexChart(element, chartOption) {
    const selector = '#' + element;
    if (chartOption !== undefined) {
      const chart = new ApexCharts(document.querySelector(selector), chartOption);
      chart.render();
    }
  }

  public accordionToggle($) {
    $('.iq-accordion .iq-accordion-block .accordion-details').hide();
    $('.iq-accordion .iq-accordion-block:first').addClass('accordion-active').children().slideDown('slow');
    $(document).on("click", '.iq-accordion .iq-accordion-block', function() {
        if ($(this).children('div.accordion-details ').is(':hidden')) {
            $('.iq-accordion .iq-accordion-block').removeClass('accordion-active').children('div.accordion-details ').slideUp('slow');
            $(this).toggleClass('accordion-active').children('div.accordion-details ').slideDown('slow');
        }
    });
  }
}
