"use client";

import { useState } from 'react';

export default function LibraryInfoPanel() {
  const [isFirstVisit] = useState(() => {
    if (typeof window !== 'undefined') {
      const hasSeenPanel = localStorage.getItem('library-panel-seen');
      if (!hasSeenPanel) {
        localStorage.setItem('library-panel-seen', 'true');
        return true;
      }
    }
    return false;
  });

  return (
    <div 
      className={`bg-white/95 backdrop-blur-md border-2 border-white/50 rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[60vh] transition-all duration-500 scrollbar-hide ${
        isFirstVisit ? 'ring-4 ring-yellow-300 ring-opacity-70 animate-pulse' : ''
      }`}
      style={{ animationDuration: '2s', animationIterationCount: '3' }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b-2 border-usant-red/20 pb-3">
          <h2 className="text-xl font-bold text-usant-red mb-1">Library Policies & Hours</h2>
          <p className="text-xs text-gray-700">Please review the following information before accessing library services</p>
        </div>

        {/* Rules & Regulations */}
        <section>
          <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-usant-red rounded-full"></span>
            RULES AND REGULATIONS
          </h3>
          <ol className="space-y-2.5 text-xs text-gray-800 leading-relaxed">
            <li className="flex gap-2.5">
              <span className="font-bold text-usant-red flex-shrink-0 text-sm">1.</span>
              <span>Students must be in <strong>proper uniform</strong> with a <strong>valid ID</strong> when entering the library.</span>
            </li>
            <li className="flex gap-2.5">
              <span className="font-bold text-usant-red flex-shrink-0 text-sm">2.</span>
              <span><strong>Grade School, Junior High, and Senior High students</strong> must present their library card with a photo.</span>
            </li>
            <li className="flex gap-2.5">
              <span className="font-bold text-usant-red flex-shrink-0 text-sm">3.</span>
              <span><strong>General References</strong> (e.g., dictionaries, encyclopedias) and <strong>Theses/Dissertations</strong> are for <strong className="text-red-600">in-library use only</strong>.</span>
            </li>
            <li className="flex gap-2.5">
              <span className="font-bold text-usant-red flex-shrink-0 text-sm">4.</span>
              <span><strong>Reserve books</strong> for overnight use may be borrowed at <strong>4:00 P.M.</strong> and returned by <strong>9:00 A.M.</strong> the following day. Late returns incur a <strong className="text-red-600">₱1.00/hour fine</strong>.</span>
            </li>
            <li className="flex gap-2.5">
              <span className="font-bold text-usant-red flex-shrink-0 text-sm">5.</span>
              <span><strong>Fiction/Circulation books</strong> may be borrowed for <strong>three (3) days</strong>. Late returns incur a <strong className="text-red-600">₱9.00/day fine</strong>.</span>
            </li>
            <li className="flex gap-2.5">
              <span className="font-bold text-usant-red flex-shrink-0 text-sm">6.</span>
              <span>Borrowers are <strong>responsible for loaned books</strong>. Lost or damaged books must be <strong>replaced or paid for</strong>.</span>
            </li>
            <li className="flex gap-2.5">
              <span className="font-bold text-usant-red flex-shrink-0 text-sm">7.</span>
              <span><strong className="text-red-600">Stealing or damaging</strong> library materials will result in <strong>serious disciplinary action</strong>.</span>
            </li>
            <li className="flex gap-2.5">
              <span className="font-bold text-usant-red flex-shrink-0 text-sm">8.</span>
              <span><strong>Silence must be maintained</strong> in the library. Violations will result in disciplinary action.</span>
            </li>
            <li className="flex gap-2.5">
              <span className="font-bold text-usant-red flex-shrink-0 text-sm">9.</span>
              <span>Only <strong>faculty members</strong> may borrow reference books.</span>
            </li>
          </ol>
        </section>

        {/* Library Hours */}
        <section>
          <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-usant-orange rounded-full"></span>
            LIBRARY HOURS/SCHEDULE
          </h3>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b-2 border-usant-red">
                  <th className="text-left py-1.5 font-bold text-gray-900">Library</th>
                  <th className="text-left py-1.5 font-bold text-gray-900">Time</th>
                  <th className="text-left py-1.5 font-bold text-gray-900">Days</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-white/50">
                  <td className="py-2 font-semibold text-gray-800">Grade School</td>
                  <td className="py-2 text-gray-700">7:30 AM - 5:00 PM</td>
                  <td className="py-2 text-gray-700">Mon-Fri</td>
                </tr>
                <tr className="hover:bg-white/50">
                  <td className="py-2 font-semibold text-gray-800">Junior High</td>
                  <td className="py-2 text-gray-700">7:30 AM - 5:00 PM</td>
                  <td className="py-2 text-gray-700">Mon-Fri</td>
                </tr>
                <tr className="hover:bg-white/50">
                  <td className="py-2 font-semibold text-gray-800">Senior High</td>
                  <td className="py-2 text-gray-700">7:30 AM - 5:00 PM</td>
                  <td className="py-2 text-gray-700">Mon-Fri</td>
                </tr>
                <tr className="hover:bg-white/50 bg-blue-50/50">
                  <td className="py-2 font-semibold text-gray-800">College</td>
                  <td className="py-2 text-gray-700">7:30 AM - 5:00 PM</td>
                  <td className="py-2 text-gray-700 font-semibold">Mon-Sat</td>
                </tr>
                <tr className="hover:bg-white/50 bg-blue-50/50">
                  <td className="py-2 font-semibold text-gray-800">Graduate School</td>
                  <td className="py-2 text-gray-700">7:30 AM - 5:00 PM</td>
                  <td className="py-2 text-gray-700 font-semibold">Mon-Sat</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
