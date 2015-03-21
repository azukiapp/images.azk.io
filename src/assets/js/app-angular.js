// /**
//  * Markdown Config
//  * @type {Boolean}
//  */

// marked.setOptions({
//   gfm: true,
//   tables: true,
//   breaks: false,
//   pedantic: false,
//   sanitize: true,
//   smartLists: true,
//   smartypants: false,
//   langPrefix: 'language-'
// });


// // Prism Regex
// var PrismlangRegEX = /\blang(?:uage)?-(?!\*)(\w+)\b/i;


// /**
//  * Creates App
//  * @type {[type]}
//  */

// var AzkImagesApp = angular.module('app', [
//   'ui.router'
// ]);


// /**
//  * Config application `Routes` (States)
//  * @param  {[type]} $stateProvider
//  * @return {[type]}
//  */

// AzkImagesApp.config(function AzkImagesAppConfig($stateProvider) {

//   /**
//    * Controller: Index
//    * @return {[type]}               [description]
//    */

//   $stateProvider.state('home', {
//     url: '',
//     controller: 'HomeCtrl',
//     templateUrl: 'templates/home.html'
//   });


//   /**
//    * Controller: Project Show
//    * @return {[type]}               [description]
//    */

//   $stateProvider.state('project', {
//     url: '/:projectId',
//     controller: 'ProjectCtrl',
//     templateUrl: 'templates/project.html',
//     resolve: {
//       dockerfile: function dockerfileResolver($http, $state, $stateParams) {
//         return $http({
//           method: 'GET',
//           url: 'https://api.github.com/repos/azukiapp/docker-' + $stateParams.projectId + '/contents/Dockerfile',
//           headers: {
//             Accept: 'application/vnd.github.VERSION.raw'
//           }
//         }).then(function dockerfileResolverSuccess(res) {
//             return res.data;
//           },
//           function dockerfileResolverError(res) {
//             console.error('Project:Dockerfile - Ajax:Error:', res);
//             return null;
//           }
//         );
//       },
//       readme: function readmeResolver($http, $state, $stateParams) {
//         return $http({
//           method: 'GET',
//           url: 'https://api.github.com/repos/azukiapp/docker-' + $stateParams.projectId + '/readme',
//           headers: {
//             Accept: 'application/vnd.github.VERSION.raw'
//           }
//         }).then(
//           function resolveReadmeSuccess(res) {
//             // console.log('README Data: ', res.data);
//             return res.data;
//           },
//           function resolveReadmeError(res) {
//             console.error('Project:README - Ajax:Error:', res);
//             console.error(res);
//             return null;
//           }
//         );
//       }
//       // ,
//       // dockerfileVersioned: function dockerfileVersionResolver($http, $state, $stateParams, $scope) {
//       //   if ( ! $stateParams.version) return null;

//       //   return $http({
//       //     method: 'GET',
//       //     url: 'https://api.github.com/repos/azukiapp/docker-' + $stateParams.projectId + '/readmeheiauheiahepiahepiahepiahebcde',
//       //     headers: {
//       //       Accept: 'application/vnd.github.VERSION.raw'
//       //     }
//       //   }).then(function dockerfileVersionResolverSuccess(res) {
//       //       return res.data;
//       //     },
//       //     function dockerfileVersionResolverError(res) {
//       //       console.error('ProjectVersion:Dockerfile - Ajax:Error:', res);
//       //       return null;
//       //     }
//       //   );
//       // }
//     }
//   });


//   /**
//    * Controller: Project Version
//    * @return {[type]}               [description]
//    */

//   $stateProvider.state('project.dockerfileVersion', {
//     url: '/:dockerfileUrl',
//     controller: 'DockerfileVersionCtrl',
//     templateUrl: 'templates/project-version.html',
//     resolve: {
//      dockerfileVersioned: function dockerfileVersionResolver($http, $state, $stateParams, $scope) {
//         return $http({
//           method: 'GET',
//           url: 'https://api.github.com/repos/azukiapp/docker-' + $stateParams.projectId + '/readmeheiauheiahepiahepiahepiahebcde',
//           headers: {
//             Accept: 'application/vnd.github.VERSION.raw'
//           }
//         }).then(function dockerfileVersionResolverSuccess(res) {
//             return res.data;
//           },
//           function dockerfileVersionResolverError(res) {
//             console.error('ProjectVersion:Dockerfile - Ajax:Error:', res);
//             return null;
//           }
//         );
//       }
//     }
//   });

// // `.config` eof
// });

// /**
//  * App Initialization
//  * @param  {[type]} $http      [description]
//  * @param  {[type]} $rootScope [description]
//  * @param  {[type]} $state
//  * @return {[type]}            [description]
//  */

// AzkImagesApp.run(function AzkImagesAppRun($http, $rootScope, $state) {
//   $rootScope.projects = [];
//   $rootScope.showRightSidebar = false;
//   $http.get('https://api.github.com/search/repositories?q=user:azukiapp+fork:true+docker-+in:name')
//     .success(function (data) {
//       var projects = data.items,
//           filteredProjects;

//       // Filters Dockerfiles
//       var black_list   = ['docker-registry-downloader'];
//       var regex_filter = /^docker-/;
//       filteredProjects = _.filter(projects, function(project) {
//         return !_.contains(black_list, project.name) && project.name.match(regex_filter) ;
//       });

//       // Serializes each project object to suit view needs
//       $rootScope.projects = _.map(filteredProjects, function(project){
//         return {
//           id: project.name.replace(/docker-/, ''),
//           name: project.name.replace(/docker-/, '').replace(/-/, ' '),
//           description: project.description
//         }
//       });
//     })
//     .error(function (err) {
//       // TODO:
//       // ❍  add a proper error handler
//       alert(err.message);
//       $state.go('home');
//     });
// });


// /**
//  * Controller: Home
//  * @param  {[type]} $scope
//  * @return {[type]}         [description]
//  */

// AzkImagesApp.controller('HomeCtrl', function HomeCtrl($scope) {
//   console.log('Home.Controller');
//   $scope.showRightSidebar = true;
// });


// /**
//  * Controller: Project
//  * @param  {[type]} $sce         [description]
//  * @param  {[type]} $scope       [description]
//  * @param  {[type]} $stateParams [description]
//  * @param  {[type]} dockerfile   [description]
//  * @param  {[type]} readme
//  * @return {[type]}              [description]
//  */

// AzkImagesApp.controller('ProjectCtrl', function ProjectCtrl($sce, $scope, $stateParams, readme, dockerfile) {
//   console.log('ProjectCtrl');
//   $scope.showRightSidebar   = true;
//   $scope.projectId          = $stateParams.projectId;

//   // 1. ✔  Parse <versions /> from README.md - https://regex101.com/r/mO8dD0/1
//   var versionsMarkupRegexp  = new RegExp(/<versions>\n((.|\n)*?)<\/versions>/);
//   var parsedMarkupVersions  = readme.match(versionsMarkupRegexp)[1].split("\n").slice(0,-1);

//   // 2. ✔  Extract Version and URL - https://regex101.com/r/vK7gP2/1
//   var versionAndLabel       = new RegExp(/\[(.*)\]\((.*)\)/);

//   // 3. ✔ Removes "`" character from Version - https://regex101.com/r/pY2yE3/1
//   var matchMarkers          = new RegExp(/(`)/g);

//   var v, name, id;
//   var versions              = _.map(parsedMarkupVersions, function(versionMarkdown){
//     v         = versionMarkdown.match(versionAndLabel);
//     name      = v[1].replace(matchMarkers, "");
//     id        = name.replace(/(, )/g, ','); // creates a slug with the name
//     return {id: id, name: name, url: v[2]};
//   });

//   // Wrap dockerfile in a <code /> block
//   if (dockerfile) {
//     dockerfile = ['<code class="dockerfile" class="language-dockerfile" >', dockerfile, '</code>'].join("");
//   };

//   $scope.dockerfile         = $sce.trustAsHtml(dockerfile);
//   $scope.readme             = $sce.trustAsHtml(marked(readme));
//   $scope.dockerVersions     = versions;
// });


// AzkImagesApp.controller('DockerfileVersionCtrl', function DockerfileVersionCtrl($sce, $scope, $stateParams, readme, dockerfile, dockerfileVersioned) {
//   // All $scope attributes inherits from 'ProjectCtrl'
//   console.log('ProjectVersionCtrl');
//   console.log('Dockerversion ->', dockerfileVersioned);
// });


// /**
//  * Directive: Hightlight Code
//  * @param  {[type]} $compile
//  * @param  {[type]}
//  * @return {[type]}                 [description]
//  */

// AzkImagesApp.directive('doHighlight', ['$compile', function ($compile) {
//   return function(scope, element, attrs) {
//     var isCode = (element.tagName === 'CODE' && PrismlangRegEX.test(element.attr('class')));
//     var codeSelector = 'code';

//     scope.$watch(
//       // watch the 'doCompile' expression for changes
//       function(scope) {
//         return scope.$eval(attrs.doCompile);
//       },
//       // when the 'doCompile' expression changes
//       function(value) {
//         // assign it into the current DOM
//         // element.html(value);
//         var elms = (isCode) ? element : element.find(codeSelector);
//         elms.each(function(ix, elm) {
//           // if elm.textContent is Azkfile.js
//           // replace language to 'azkfile'
//           // https://regex101.com/r/iO8qI8/1
//           if (/Azkfile(\.js)?|^systems\(/gmi.test(elm.textContent)) {
//             if (/(language-|lang-).*/gm.test(elm.className)) {
//               elm.className = elm.className.replace(/(language-|lang-).*/gm, "$1azkfile");
//             } else {
//               elm.className = 'language-azkfile';
//             }
//           }

//           Prism.highlightElement(elm);
//         });

//         // compile the new DOM and link it to the current
//         // scope.
//         // NOTE: we only compile .childNodes so that
//         // we don't get into infinite loop compiling ourselves
//         $compile(element.contents())(scope);
//       }
//     );
//   };
// }]);
