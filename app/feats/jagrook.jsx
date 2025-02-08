// import React from 'react';
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
// import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
// import { ExternalLink, AlertTriangle, Book } from 'lucide-react';

// const Jagrook = () => {
//   const governmentResources = [
//     {
//       title: 'ABHA (Ayushman Bharat Health Account)',
//       description: 'Create your unique health ID and access digital health records securely.',
//       link: 'https://abha.gov.in/',
//     },
//     {
//       title: 'National Health Portal',
//       description: 'Gateway to authentic health information and Indian health services.',
//       link: 'https://www.nhp.gov.in/',
//     },
//     {
//       title: 'Ministry of Health and Family Welfare',
//       description: 'Official portal for health policies and programs in India.',
//       link: 'https://www.mohfw.gov.in/',
//     },
//     {
//       title: 'Indian Council of Medical Research',
//       description: 'Latest medical research and health guidelines.',
//       link: 'https://www.icmr.gov.in/',
//     },
//   ];

//   const diseaseVideos = [
//     {
//       title: 'Understanding Diabetes',
//       thumbnail: '/api/placeholder/320/180',
//       link: 'https://youtube.com/example1',
//     },
//     {
//       title: 'Heart Disease Prevention',
//       thumbnail: '/api/placeholder/320/180',
//       link: 'https://youtube.com/example2',
//     },
//     {
//       title: 'Managing Hypertension',
//       thumbnail: '/api/placeholder/320/180',
//       link: 'https://youtube.com/example3',
//     },
//     {
//       title: 'Mental Health Awareness',
//       thumbnail: '/api/placeholder/320/180',
//       link: 'https://youtube.com/example4',
//     },
//   ];

//   const medicineInfo = [
//     {
//       title: 'Prescription Medicines',
//       warnings: [
//         'Never self-medicate',
//         'Always consult a qualified healthcare professional',
//         'Complete the full course as prescribed',
//         'Check for allergies and contraindications',
//       ],
//     },
//     {
//       title: 'Medicine Storage',
//       warnings: [
//         'Store in a cool, dry place',
//         'Keep away from direct sunlight',
//         'Store out of reach of children',
//         'Check expiration dates regularly',
//       ],
//     },
//     {
//       title: 'Side Effects',
//       warnings: [
//         'Monitor for adverse reactions',
//         'Report unusual symptoms to your doctor',
//         'Keep track of all medications taken',
//         'Be aware of drug interactions',
//       ],
//     },
//   ];

//   return (
//     <>
//     <Appbar.Header>
//             <Appbar.BackAction onPress={() => router.push('(tabs)')} />
//                 <Text style={{fontSize:20}}>Jagrook</Text>
//         </Appbar.Header>
//     <div className="container mx-auto p-6 space-y-8">
//       {/* Government Resources Section */}
//       <section className="space-y-4">
//         <h2 className="text-2xl font-bold mb-4">Government Healthcare Resources</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {governmentResources.map((resource, index) => (
//             <Card key={index} className="hover:shadow-lg transition-shadow">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <ExternalLink className="w-5 h-5" />
//                   {resource.title}
//                 </CardTitle>
//                 <CardDescription>{resource.description}</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <a 
//                   href={resource.link}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-600 hover:underline"
//                 >
//                   Visit Website
//                 </a>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </section>

//       {/* Disease Videos Section */}
//       <section className="space-y-4">
//         <h2 className="text-2xl font-bold mb-4">Educational Videos</h2>
//         <ScrollArea className="w-full whitespace-nowrap rounded-md border">
//           <div className="flex w-max space-x-4 p-4">
//             {diseaseVideos.map((video, index) => (
//               <a
//                 key={index}
//                 href={video.link}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="inline-block"
//               >
//                 <Card className="w-80">
//                   <img
//                     src={video.thumbnail}
//                     alt={video.title}
//                     className="rounded-t-lg"
//                   />
//                   <CardContent className="p-4">
//                     <p className="font-semibold">{video.title}</p>
//                   </CardContent>
//                 </Card>
//               </a>
//             ))}
//           </div>
//           <ScrollBar orientation="horizontal" />
//         </ScrollArea>
//       </section>

//       {/* Medicine Information Section */}
//       <section className="space-y-4">
//         <h2 className="text-2xl font-bold mb-4">Medicine Safety Information</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {medicineInfo.map((info, index) => (
//             <Card key={index} className="bg-orange-50">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <AlertTriangle className="w-5 h-5 text-orange-500" />
//                   {info.title}
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <ul className="list-disc list-inside space-y-2">
//                   {info.warnings.map((warning, wIndex) => (
//                     <li key={wIndex} className="text-sm text-gray-700">
//                       {warning}
//                     </li>
//                   ))}
//                 </ul>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </section>
//     </div>
//     </>
//   );
// };

// export default Jagrook;
