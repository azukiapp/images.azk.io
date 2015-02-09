marked.setOptions({
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false,
  langPrefix: 'language-'
});

var PrismlangRegEX = /\blang(?:uage)?-(?!\*)(\w+)\b/i;


angular.module('app', [
  'ui.router'
]).config(function ($stateProvider) {
  $stateProvider
    .state('home', {
      url: '',
      controller: 'HomeCtrl',
      templateUrl: 'templates/home.html'
    })
    .state('project', {
      url: '/:projectId',
      controller: 'ProjectCtrl',
      templateUrl: 'templates/project.html',
      resolve: {
        dockerfile: function ($http, $state, $stateParams) {
          return $http({
            method: 'GET',
            url: 'https://api.github.com/repos/azukiapp/docker-' + $stateParams.projectId + '/contents/Dockerfile',
            headers: {
              Accept: 'application/vnd.github.VERSION.raw'
            }
          }).then(
            function (res) {
              return res.data;
            },
            function (res) {
              console.error(res);
              return null;
            }
          );
        },
        readme: function ($http, $state, $stateParams) {
          return $http({
            method: 'GET',
            url: 'https://api.github.com/repos/azukiapp/docker-' + $stateParams.projectId + '/readme',
            headers: {
              Accept: 'application/vnd.github.VERSION.raw'
            }
          }).then(
            function (res) {
              return res.data;
            },
            function (res) {
              console.error(res);
              return null;
            }
          );
        }
      }
    });
}).run(function ($http, $rootScope, $state) {
  $rootScope._ = _;
  $rootScope.projects = [];

  $http.get('https://api.github.com/search/repositories?q=docker+in:name+user:azukiapp')
    .success(function (data) {
      var projects = data.items;
      _.sortBy(projects, 'name').forEach(function (project) {
        if (!_.contains(['dockerfiles', 'docker-registry-downloader'], project.name)) {
          $rootScope.projects.push({
            id: project.name.replace(/docker-/, ''),
            name: project.name.replace(/docker-/, '').replace(/-/, ' '),
            description: project.description
          });
        }
      });
    })
    .error(function (err) {
      alert(err.message);
      $state.go('home');
    });
}).controller('HomeCtrl', function ($scope) {
  // ...
}).controller('ProjectCtrl', function ($sce, $scope, $stateParams, dockerfile, readme) {
  $scope.projectId = $stateParams.projectId;


  // var highlightedDockerfile = Prism.highlight(dockerfile, Prism.languages.dockerfile, dockerfile);
  // $scope.dockerfile = $sce.trustAsHtml(highlightedDockerfile);
  $scope.dockerfile = $sce.trustAsHtml(dockerfile);

  $scope.readme = $sce.trustAsHtml(marked(readme));
})

.directive('doHighlight', ['$compile', function ($compile) {
  return function(scope, element, attrs) {
    var isCode = PrismlangRegEX.test(element.attr('class'));
    var codeSelector = 'code';

    scope.$watch(
      // watch the 'doCompile' expression for changes
      function(scope) {
        return scope.$eval(attrs.doCompile);
      },
      // when the 'doCompile' expression changes
      function(value) {
        // assign it into the current DOM
        // element.html(value);
        var elms = (isCode) ? element : element.find(codeSelector);

        elms.each(function(ix, elm) {
          // if elm.textContent is Azkfile.js
          // replace language to 'azkfile'
          // https://regex101.com/r/iO8qI8/1
          if (/Azkfile(\.js)?|^systems\(/gmi.test(elm.textContent)) {
            if (/(language-|lang-).*/gm.test(elm.className)) {
              elm.className = elm.className.replace(/(language-|lang-).*/gm, "$1azkfile");
            } else {
              elm.className = 'language-azkfile';
            }
          }

          Prism.highlightElement(elm);
        });

        // compile the new DOM and link it to the current
        // scope.
        // NOTE: we only compile .childNodes so that
        // we don't get into infinite loop compiling ourselves
        $compile(element.contents())(scope);
      }
    );
  };
}]);
;
