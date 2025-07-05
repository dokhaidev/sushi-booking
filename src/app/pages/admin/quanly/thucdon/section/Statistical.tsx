"use client"

import { Card, CardContent } from "../../../../../components/ui/Card"
import type React from "react"
import { useFetch } from "../../../../../hooks/useFetch"
import { FaUtensils, FaLayerGroup, FaHamburger, FaGift } from "react-icons/fa"

export default function StatisticalComponent({
  categoryRef,
  groupRef,
  foodRef,
  comboRef,
}: {
  categoryRef: React.RefObject<HTMLDivElement | null>
  groupRef: React.RefObject<HTMLDivElement | null>
  foodRef: React.RefObject<HTMLDivElement | null>
  comboRef: React.RefObject<HTMLDivElement | null>
}) {
  const { categories, foodGroups, foods, combos } = useFetch()

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" })
  }

  const statisticalData = [
    {
      label: "Tổng danh mục",
      value: categories.length,
      ref: categoryRef,
      icon: <FaLayerGroup className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "Loại danh mục",
      value: foodGroups.length,
      ref: groupRef,
      icon: <FaUtensils className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      label: "Tổng món ăn",
      value: foods.length,
      ref: foodRef,
      icon: <FaHamburger className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
    {
      label: "Tổng combo",
      value: combos.length,
      ref: comboRef,
      icon: <FaGift className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ]

  return (
    <div className="col-span-12">
      {/* Desktop and Tablet Layout */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {statisticalData.map((item, index) => (
          <Card
            key={index}
            className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-md"
            onClick={() => scrollToSection(item.ref)}
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2 leading-tight">
                    {item.label}
                  </p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-none">{item.value}</p>
                </div>
                <div className={`p-2 sm:p-3 rounded-lg bg-gradient-to-r ${item.color} text-white ml-2 sm:ml-4`}>
                  {item.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mobile Layout */}
      <div className="sm:hidden space-y-3">
        {statisticalData.map((item, index) => (
          <Card
            key={index}
            className="cursor-pointer hover:shadow-md transition-all duration-200 border-0 shadow-sm"
            onClick={() => scrollToSection(item.ref)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${item.bgColor} flex-shrink-0`}>
                  <div className={item.textColor}>{item.icon}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-600 truncate">{item.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{item.value}</p>
                </div>
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Bar for Mobile */}
      <div className="sm:hidden mt-4 p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-orange-800">Tổng cộng:</span>
          <span className="font-bold text-orange-900">
            {categories.length + foodGroups.length + foods.length + combos.length} mục
          </span>
        </div>
      </div>
    </div>
  )
}
